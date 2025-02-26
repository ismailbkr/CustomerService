# Kullanıcı Kayıt/Giriş ve AWS SageMaker Tabanlı Chatbot Uygulaması (Backend)

Bu proje, kullanıcının kayıt/giriş işlemlerini ve sonrasında AWS SageMaker üzerinde barındırılan bir yapay zeka modeliyle etkileşimi sağlayan bir arka uç (backend) uygulamasını örnekler.

## İçindekiler
1. [Özet](#özet)
2. [Mimari Bileşenler](#mimari-bileşenler)
3. [Akış Şeması](#akış-şeması)
4. [Kurulum ve Yapılandırma](#kurulum-ve-yapılandırma)
5. [AWS Kısımları](#aws-kısımları)
   - [1. DynamoDB](#1-dynamodb)
   - [2. AWS Lambda (Python)](#2-aws-lambda-python)
   - [3. AWS API Gateway](#3-aws-api-gateway)
   - [4. AWS SageMaker](#4-aws-sagemaker)
6. [CI/CD - GitHub Actions](#cicd---github-actions)
7. [API Endpointleri](#api-endpointleri)
8. [Örnek Kod Yapısı](#örnek-kod-yapısı)
9. [Test ve Doğrulama](#test-ve-doğrulama)
10. [Notlar](#notlar)

---

## Özet

- **Kullanıcı Kayıt/Giriş**: Kullanıcı e-posta ve şifre ile kayıt olur. Aynı e-posta ile ikinci kez kayıt olunamaz. Zaten kayıtlı kullanıcı giriş yapar.
- **AWS DynamoDB**: Kullanıcıların `email`, `id` ve `password` bilgileri burada saklanır.
- **AWS Lambda (Python)**:  
  - Kullanıcı işlemleri (`register`, `login`) Lambda fonksiyonları ile yönetilir.  
  - Chatbot için gönderilen mesajlar, SageMaker endpoint’ine istek yapan bir Lambda fonksiyonu üzerinden iletilir.
- **AWS API Gateway**: Lambda fonksiyonlarıyla haberleşmek için HTTP endpointleri sağlanır.  
- **AWS SageMaker**: Kullanıcının sohbet ettiği yapay zeka modeli burada eğitilir ve barındırılır.
- **CI/CD (GitHub Actions)**: Projede yapılan değişiklikleri otomatik test ve dağıtım (deploy) iş akışlarıyla yönetir.

---

## Mimari Bileşenler

1. **Frontend** (Hazır olduğu varsayılmaktadır.)  
   - Kullanıcı, kayıt/giriş formlarına veri girişi yapar ve sohbet ekranında mesajlarını yazar.
2. **Backend**  
   - **AWS Lambda (Python)**: Kayıt ve giriş fonksiyonları, chatbot istek fonksiyonu.  
   - **AWS API Gateway**: HTTP isteklerini Lambda fonksiyonlarına yönlendirir.  
   - **AWS DynamoDB**: Kullanıcı bilgilerini saklar.  
   - **AWS SageMaker**: Chatbot modelinin eğitildiği ve barındırıldığı kısım.

---
