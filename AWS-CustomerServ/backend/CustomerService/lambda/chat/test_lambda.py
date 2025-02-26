import json
from lambda_function import lambda_handler

def test_lambda():
    # Test senaryoları
    test_cases = [
        {
            "body": json.dumps({
                "message": "sipariş vermek istiyorum nasıl yapabilirim"
            })
        },
        {
            "body": json.dumps({
                "message": "kargom nerede görebilir miyim"
            })
        },
        {
            "body": json.dumps({
                "message": "ürün almak istiyorum"
            })
        }
    ]

    print("\n=== Lambda Fonksiyonu Test Sonuçları ===\n")

    # Her test senaryosunu çalıştır
    for i, test_event in enumerate(test_cases, 1):
        print(f"\nTest #{i}")
        print("Girdi:", json.loads(test_event['body'])['message'])
        
        # Lambda fonksiyonunu çağır
        response = lambda_handler(test_event, None)
        
        # Sonuçları yazdır
        if response['statusCode'] == 200:
            result = json.loads(response['body'])
            print(f"Kategori: {result['category']}")
            print(f"Cevap: {result['message']}")
            print(f"Eşleşme Oranı: {result['confidence']:.2%}")
        else:
            print(f"Hata: {json.loads(response['body'])['error']}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_lambda() 