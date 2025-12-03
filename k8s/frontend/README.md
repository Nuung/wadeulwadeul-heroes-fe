# Frontend Kubernetes Configuration

이 디렉토리는 와들와들 히어로즈 프론트엔드 애플리케이션의 Kubernetes 배포 설정을 포함합니다.

## 개요

- **배포 방식**: SSG (Static Site Generation)
- **웹 서버**: nginx 1.27-alpine
- **Node 버전**: 22 (고정)
- **Vite 버전**: 5.0 (고정)
- **네임스페이스**: goormthon-5

## 아키텍처

```
[빌드 스테이지]
Node 22 → Vite Build (SSG) → Static Files

[런타임 스테이지]
Nginx → Static Files Serving
```

## 파일 구조

```
k8s/frontend/
├── README.md              # 이 문서
├── namespace.yaml         # Namespace 정의
├── frontend.yaml          # Deployment & Service 정의
├── ingress.yaml          # Ingress 정의
└── kustomization.yaml    # Kustomize 설정
```

## 주요 설정

### Deployment 사양

- **Replicas**: 2
- **전략**: RollingUpdate (maxSurge: 1, maxUnavailable: 0)
- **컨테이너 포트**: 80
- **이미지**: `837126493345.dkr.ecr.ap-northeast-2.amazonaws.com/goormthon-5/frontend:latest`

### 리소스 제한

```yaml
requests:
  memory: "128Mi"
  cpu: "100m"
limits:
  memory: "256Mi"
  cpu: "500m"
```

### 헬스체크

- **Liveness Probe**: `/health` (초기 지연 30초, 주기 10초)
- **Readiness Probe**: `/health` (초기 지연 10초, 주기 5초)

### 서비스

- **타입**: ClusterIP
- **포트**: 80 → 80

### Ingress

- **호스트**: `goormthon-5.goorm.training`
- **경로**: `/` (모든 경로)
- **SSL 리다이렉트**: 비활성화

## 배포 방법

### 1. Jenkins 빌드

Jenkins에서 다음 파라미터로 빌드:

- **Repository**: wadeulwadeul-heroes-fe
- **Branch**: main (또는 원하는 브랜치)
- **Image Tag**: latest (또는 특정 버전)

Jenkins는 자동으로:
1. 코드 체크아웃
2. Docker 이미지 빌드
3. ECR에 이미지 푸시

### 2. ArgoCD 배포

ArgoCD에서 배포:

```bash
# Kustomize를 사용한 배포 확인
kubectl kustomize k8s/frontend

# 직접 배포 (필요시)
kubectl apply -k k8s/frontend
```

## 배포 확인

```bash
# Pod 상태 확인
kubectl get pods -n goormthon-5 -l app=frontend

# Deployment 상태 확인
kubectl get deployment -n goormthon-5 frontend-deployment

# Service 확인
kubectl get svc -n goormthon-5 frontend-service

# Ingress 확인
kubectl get ingress -n goormthon-5 frontend-ingress

# 로그 확인
kubectl logs -n goormthon-5 -l app=frontend --tail=100 -f

# 헬스체크
curl http://goormthon-5.goorm.training/health
```

## 로컬 Docker 빌드 테스트

```bash
# 이미지 빌드
docker build -t frontend:test .

# 로컬 실행
docker run -p 8080:80 frontend:test

# 헬스체크 테스트
curl http://localhost:8080/health

# 브라우저에서 확인
open http://localhost:8080
```

## 트러블슈팅

### Pod가 시작되지 않는 경우

```bash
# Pod 상세 정보 확인
kubectl describe pod -n goormthon-5 -l app=frontend

# 이벤트 확인
kubectl get events -n goormthon-5 --sort-by='.lastTimestamp'
```

### 헬스체크 실패

```bash
# Pod 내부에서 헬스체크 테스트
kubectl exec -n goormthon-5 -it <pod-name> -- wget -O- http://localhost/health
```

### Ingress 접속 불가

```bash
# Ingress 컨트롤러 확인
kubectl get pods -n ingress-nginx

# Ingress 상세 정보
kubectl describe ingress -n goormthon-5 frontend-ingress
```

## 주의사항

1. **버전 고정**: Node 22, Vite 5.0은 고정 버전입니다. 변경하지 마세요.
2. **환경 변수**: 이 설정은 환경 변수를 사용하지 않습니다. 모든 설정은 빌드 타임에 결정됩니다.
3. **Static 파일만**: Node 프로세스를 실행하지 않고 nginx로 정적 파일만 서빙합니다.
4. **이미지 태그**: Jenkins에서 빌드 후 자동으로 latest 태그가 업데이트됩니다.

## 참고 자료

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Kustomize 공식 문서](https://kustomize.io/)
- [Vite 공식 문서](https://vitejs.dev/)
