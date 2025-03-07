# CI/CD Pipeline Kılavuzu

Bu repository, Customer Service uygulaması için CI/CD pipeline'larını içerir. Bu kılavuz, pipeline'ların nasıl çalıştığını ve nasıl kullanılacağını açıklar.

## Pipeline'lar

Bu repository'de üç farklı CI/CD pipeline bulunmaktadır:

1. **Backend CI/CD Pipeline**: Backend uygulamasını test eder ve AWS Lambda'ya dağıtır.
2. **Frontend CI/CD Pipeline**: Frontend uygulamasını test eder ve AWS S3'e dağıtır.
3. **Infrastructure Deployment Pipeline**: AWS CloudFormation ile altyapı kaynaklarını dağıtır.

## Pipeline Detayları

### Backend CI/CD Pipeline

**Dosya**: `.github/workflows/backend-ci-cd.yml`

**Tetikleyiciler**:
- `main` dalına push
- `AWS-CustomerServ/backend/**` dizinindeki değişiklikler
- Manuel tetikleme (workflow_dispatch)

**Adımlar**:
1. Kod checkout
2. Python kurulumu
3. Bağımlılıkların yüklenmesi
4. Kod kalitesi kontrolü (pylint)
5. Testlerin çalıştırılması (pytest)
6. Lambda fonksiyonlarının paketlenmesi
7. AWS kimlik bilgilerinin yapılandırılması
8. Lambda fonksiyonlarının AWS'ye dağıtılması
9. API Gateway'in güncellenmesi

### Frontend CI/CD Pipeline

**Dosya**: `.github/workflows/frontend-ci-cd.yml`

**Tetikleyiciler**:
- `main` dalına push
- `AWS-CustomerServ/frontend/**` dizinindeki değişiklikler
- Manuel tetikleme (workflow_dispatch)

**Adımlar**:
1. Kod checkout
2. Node.js kurulumu
3. Bağımlılıkların yüklenmesi
4. Kod kalitesi kontrolü (lint)
5. Frontend uygulamasının derlenmesi (build)
6. Testlerin çalıştırılması
7. AWS kimlik bilgilerinin yapılandırılması
8. Frontend uygulamasının S3'e dağıtılması
9. CloudFront önbelleğinin temizlenmesi (eğer CloudFront kullanılıyorsa)

### Infrastructure Deployment Pipeline

**Dosya**: `.github/workflows/infrastructure-deployment.yml`

**Tetikleyiciler**:
- `main` dalına push
- `AWS-CustomerServ/infrastructure/**` dizinindeki değişiklikler
- Manuel tetikleme (workflow_dispatch)

**Adımlar**:
1. Kod checkout
2. AWS kimlik bilgilerinin yapılandırılması
3. CloudFormation stack'inin dağıtılması
4. Stack çıktılarının alınması

## Pipeline'ları Manuel Tetikleme

Pipeline'ları manuel olarak tetiklemek için:

1. GitHub repository'nizde "Actions" sekmesine gidin.
2. İlgili workflow'u seçin.
3. "Run workflow" düğmesine tıklayın.
4. "Run workflow" düğmesine tekrar tıklayın.

## GitHub Secrets

Pipeline'ların çalışması için aşağıdaki GitHub secrets'larını ayarlamanız gerekir:

- `AWS_ACCESS_KEY_ID`: AWS IAM kullanıcısının Access Key ID'si
- `AWS_SECRET_ACCESS_KEY`: AWS IAM kullanıcısının Secret Access Key'i
- `AWS_REGION`: AWS bölgesi (örn. us-east-1)
- `S3_BUCKET`: Frontend uygulaması için S3 bucket adı
- `API_GATEWAY_ID`: API Gateway ID'si
- `CLOUDFRONT_DISTRIBUTION_ID`: (İsteğe bağlı) CloudFront Distribution ID'si

## AWS Kaynaklarını Oluşturma

AWS kaynaklarını oluşturmak için `AWS-CustomerServ/aws-setup-guide.md` dosyasındaki adımları izleyin.

## AWS Free Tier Kapsamında Kalma

Bu pipeline'lar, AWS Free Tier kapsamında kalacak şekilde tasarlanmıştır. Aşağıdaki noktalara dikkat edin:

1. Tek bir ortam kullanılmaktadır (geliştirme ve üretim ortamları birleştirilmiştir).
2. Gereksiz AWS kaynakları kullanılmamaktadır.
3. CloudFront kullanımı isteğe bağlıdır (S3 statik web hosting doğrudan kullanılabilir).

## Sorun Giderme

Pipeline'lar çalışmazsa:

1. GitHub Actions sekmesinde hata mesajlarını kontrol edin.
2. GitHub secrets'larının doğru ayarlandığından emin olun.
3. AWS kaynaklarının doğru oluşturulduğundan emin olun.
4. AWS IAM kullanıcısının gerekli izinlere sahip olduğundan emin olun. 