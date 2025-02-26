import json
import boto3
import re
import os
from typing import Dict, List, Set, Tuple
from dotenv import load_dotenv

# Environment değişkenlerini yükle
load_dotenv()

# AWS S3 istemcisini oluştur
s3_client = boto3.client('s3',
    region_name=os.getenv('MYAWS_REGION', 'eu-north-1')
)

# Sabit değişkenleri environment'tan al
SIMILARITY_THRESHOLD = float(os.getenv('SimilarityThreshold', '0.3'))
DEFAULT_LANGUAGE = os.getenv('DEFAULT_LANGUAGE', 'tr')

def tokenize(text: str) -> Set[str]:
    """Metni tokenize eder ve kelime kümesi döndürür."""
    # Metni küçük harfe çevir ve noktalama işaretlerini kaldır
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    # Kelimeleri ayır ve küme olarak döndür
    return set(text.split())

def calculate_similarity(text1: str, text2: str) -> float:
    """İki metin arasındaki benzerlik oranını hesaplar."""
    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)
    
    # Kesişim ve birleşim kümelerini bul
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    
    # Jaccard benzerlik indeksini hesapla
    if not union:
        return 0.0
    return len(intersection) / len(union)

def get_responses_from_s3() -> List[Dict]:
    """S3'ten cevapları içeren JSON dosyasını okur."""
    try:
        bucket = os.getenv('S3_BUCKET_NAME')
        key = os.getenv('S3JsonKey')
        
        if not bucket or not key:
            raise ValueError("S3_BUCKET_NAME ve S3JsonKey environment değişkenleri gerekli")
            
        response = s3_client.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read().decode('utf-8')
        return json.loads(content).get('qa_pairs', [])
    except Exception as e:
        print(f"S3'ten veri okuma hatası: {str(e)}")
        return []

def find_best_response(user_message: str, qa_pairs: List[Dict]) -> Tuple[str, str, float]:
    """Kullanıcı mesajına en uygun cevabı bulur."""
    try:
        best_match = {
            "category": "Genel",
            "response": "Üzgünüm, sorunuza uygun bir cevap bulamadım. Lütfen sorunuzu farklı bir şekilde sorar mısınız?",
            "similarity": 0
        }

        # Her bir soru-cevap çifti için kontrol et
        for qa in qa_pairs:
            # Ana soru ile benzerlik kontrolü
            main_similarity = calculate_similarity(user_message, qa['question'])
            
            # En yüksek benzerlik skorunu bul
            max_similarity = main_similarity
            
            # Varyasyonlar ile benzerlik kontrolü
            if 'variations' in qa:
                for variation in qa['variations']:
                    similarity = calculate_similarity(user_message, variation)
                    max_similarity = max(max_similarity, similarity)
            
            # Eğer benzerlik skoru daha yüksekse ve minimum eşiği geçiyorsa
            if max_similarity > best_match['similarity'] and max_similarity > SIMILARITY_THRESHOLD:
                best_match = {
                    "category": qa.get('category', 'Genel'),
                    "response": qa['answer'],
                    "similarity": max_similarity
                }

        return best_match['category'], best_match['response'], best_match['similarity']
    except Exception as e:
        print(f"Cevap bulma hatası: {str(e)}")
        return "Genel", "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.", 0

def lambda_handler(event, context):
    """AWS Lambda handler fonksiyonu."""
    try:
        # Gelen mesajı parse et
        body = json.loads(event.get('body', '{}'))
        user_message = body.get('message')

        if not user_message:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Mesaj gerekli'
                })
            }

        # S3'ten cevapları al
        qa_pairs = get_responses_from_s3()
        
        if not qa_pairs:
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'Cevap veritabanına erişilemedi'
                })
            }

        # En iyi eşleşen cevabı bul
        category, response, similarity = find_best_response(user_message, qa_pairs)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'category': category,
                'message': response,
                'confidence': similarity
            })
        }

    except Exception as e:
        print(f"Lambda handler hatası: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Sistem hatası'
            })
        } 