import json
import os
import boto3
import hashlib
import hmac
from botocore.exceptions import ClientError

# DynamoDB bağlantısını oluştur
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')

# Kullanıcılar tablosu
USERS_TABLE = dynamodb.Table('Users')

# Güvenli bir salt değeri
SALT = "CustomerServiceSalt123"  

# CORS headers
CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
}

def hash_password(password):
    """Şifreyi güvenli bir şekilde hashle"""
    salted = (SALT + password).encode('utf-8')
    return hashlib.sha256(salted).hexdigest()

def check_password(input_password, stored_hash):
    """Şifrenin doğruluğunu kontrol et"""
    input_hash = hash_password(input_password)
    return input_hash == stored_hash

def register(event):
    """Kullanıcı kayıt işlemi"""
    try:
        print("Register fonksiyonu başladı")
        print("Event detayları:", event)

        # Request body'i parse et
        try:
            body = event.get('body', {})
            
            # Eğer body string ise JSON olarak parse et
            if isinstance(body, str):
                try:
                    body = json.loads(body)
                except json.JSONDecodeError:
                    print("JSON parse hatası")
                    return {
                        'statusCode': 400,
                        'headers': CORS_HEADERS,
                        'body': json.dumps({
                            'message': 'Geçersiz istek formatı',
                            'error': 'INVALID_JSON'
                        })
                    }
            
            print("Parsed body:", body)
            print("Body type:", type(body))
            print("Body keys:", list(body.keys()) if isinstance(body, dict) else "Not a dict")
            
            # Email ve password kontrolü
            if not isinstance(body, dict) or 'email' not in body or 'password' not in body:
                print("Missing email or password in request")
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'message': 'Email ve şifre gereklidir',
                        'error': 'MISSING_FIELDS'
                    })
                }

            email = body['email']
            password = body['password']
            
            print(f"Email: {email}, Password length: {len(password)}")

            if len(password) < 8:
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'message': 'Şifre en az 8 karakter olmalıdır.',
                        'error': 'INVALID_PASSWORD'
                    })
                }

            # Kullanıcı var mı kontrol et
            try:
                response = USERS_TABLE.get_item(Key={'email': email})
                if 'Item' in response:
                    return {
                        'statusCode': 400,
                        'headers': CORS_HEADERS,
                        'body': json.dumps({
                            'message': 'Bu e-posta adresi zaten kayıtlı.',
                            'error': 'EMAIL_EXISTS'
                        })
                    }
            except ClientError as e:
                print("DynamoDB error:", str(e))
                return {
                    'statusCode': 500,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'message': 'Veritabanı hatası',
                        'error': 'DATABASE_ERROR'
                    })
                }

            # Şifreyi hashle ve kullanıcıyı kaydet
            hashed_password = hash_password(password)
            USERS_TABLE.put_item(
                Item={
                    'email': email,
                    'password': hashed_password
                }
            )

            return {
                'statusCode': 200,
                'headers': CORS_HEADERS,
                'body': json.dumps({
                    'message': 'Kullanıcı başarıyla kaydedildi.',
                    'email': email
                })
            }

        except json.JSONDecodeError as e:
            print("JSON parse error:", str(e))
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({
                    'message': 'Geçersiz istek formatı',
                    'error': 'INVALID_JSON'
                })
            }

    except Exception as e:
        print("Unexpected error:", str(e))
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'message': str(e),
                'error': 'INTERNAL_ERROR'
            })
        }

def login(event):
    """Kullanıcı giriş işlemi"""
    try:
        print("Login fonksiyonu başladı")
        print("Event:", event)
        
        # Request body'den kullanıcı bilgilerini al
        body = json.loads(event['body'])
        email = body['email']
        password = body['password']
        
        print(f"Email: {email}")
        print("Şifre uzunluğu:", len(password))

        # Kullanıcıyı bul
        try:
            print("DynamoDB'de kullanıcı aranıyor")
            response = USERS_TABLE.get_item(Key={'email': email})
            print("DynamoDB response:", response)
            
            if 'Item' not in response:
                print("Kullanıcı bulunamadı")
                return {
                    'statusCode': 404,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({'message': 'Kullanıcı bulunamadı.'})
                }

            user = response['Item']
            print("Kullanıcı bulundu:", user)
            
            # Şifre kontrolü
            print("Şifre kontrolü yapılıyor")
            input_hash = hash_password(password)
            print("Girilen şifre hash:", input_hash)
            print("DB'deki şifre hash:", user['password'])
            
            if input_hash == user['password']:
                print("Şifre doğru")
                return {
                    'statusCode': 200,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({
                        'message': 'Giriş başarılı.',
                        'email': user['email']
                    })
                }
            else:
                print("Şifre yanlış")
                return {
                    'statusCode': 401,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({'message': 'Hatalı şifre.'})
                }

        except ClientError as e:
            print("DynamoDB hatası:", str(e))
            return {
                'statusCode': 500,
                'headers': CORS_HEADERS,
                'body': json.dumps({'message': str(e)})
            }

    except Exception as e:
        print("Beklenmeyen hata:", str(e))
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': str(e)})
        }

def lambda_handler(event, context):
    """Ana Lambda handler fonksiyonu"""
    
    # OPTIONS isteği için CORS desteği
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({})
        }
    
    # API Gateway'den gelen istekler için
    if 'httpMethod' in event and 'path' in event:
        http_method = event.get('httpMethod', '')
        path = event.get('path', '').rstrip('/')
        
        if http_method == 'POST':
            if path == '/register':
                return register(event)
            elif path == '/login':
                return login(event)
    # Doğrudan test için
    else:
        # Test olayı için varsayılan olarak register fonksiyonunu çağır
        return register(event)
    
    # Desteklenmeyen endpoint
    return {
        'statusCode': 404,
        'headers': CORS_HEADERS,
        'body': json.dumps({'message': 'Endpoint bulunamadı'})
    } 