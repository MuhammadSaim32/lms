# Deployment Architecture

## Production Overview

The LMS is deployed on **AWS EC2** using Docker, Docker Compose, Nginx, and GitHub Actions.

```mermaid
flowchart TB

    User["🌍 Users"]

    GitHub["GitHub Repository"]

    Actions["GitHub Actions"]

    EC2["AWS EC2"]

    Nginx["Nginx<br/>Reverse Proxy"]

    Client["Next.js<br/>:3000"]

    Server["Express API<br/>:8000"]

    Mongo["MongoDB"]

    Stripe["Stripe"]

    Cloudinary["Cloudinary"]

    User --> Nginx

    Nginx -->|"/"| Client
    Nginx -->|"/api/"| Server

    Client --> Server

    Server --> Mongo
    Server --> Stripe
    Server --> Cloudinary

    GitHub -->|Push to main| Actions
    Actions -->|SSH Deployment| EC2
    EC2 --> Nginx
```

## CI/CD Pipeline

Every push to the `main` branch triggers the deployment workflow.

```mermaid
flowchart LR

    Developer["👨‍💻 Developer"]

    GitHub["GitHub"]

    Actions["GitHub Actions"]

    SSH["SSH"]

    EC2["AWS EC2"]

    Pull["git pull"]

    Docker["Docker Compose"]

    App["Updated LMS"]

    Developer -->|git push| GitHub
    GitHub -->|Trigger| Actions
    Actions -->|SSH| SSH
    SSH --> EC2
    EC2 --> Pull
    Pull --> Docker
    Docker --> App
```

## Deployment Flow

```text
Developer
    │
    │ git push
    ▼
GitHub
    │
    │ workflow trigger
    ▼
GitHub Actions
    │
    │ SSH
    ▼
AWS EC2
    │
    ├── git pull
    │
    ├── Docker Compose
    │
    └── Nginx
           │
           ├── Next.js :3000
           │
           └── Express :8000
```

## Docker Architecture

```mermaid
flowchart TB

    Compose["Docker Compose"]

    Client["Next.js Container<br/>Port 3000"]

    Server["Express Container<br/>Port 8000"]

    Compose --> Client
    Compose --> Server

    Client --> Server
```

## Nginx Routing

```mermaid
flowchart LR

    Browser["Browser"]

    Nginx["Nginx"]

    Frontend["Next.js :3000"]

    Backend["Express :8000"]

    Browser --> Nginx

    Nginx -->|"/"| Frontend
    Nginx -->|"/api/"| Backend
```

Production requests therefore follow:

```text
https://your-domain.com/
        ↓
      Nginx
        ↓
   Next.js :3000
```

and:

```text
https://your-domain.com/api/v1/...
        ↓
      Nginx
        ↓
  Express :8000
```

## Deployment Documentation

For the complete deployment setup and configuration, see:

**[Deploying a MERN Stack Web App with Docker, Nginx, and GitHub Actions on AWS EC2](https://medium.com/@muhammadsaim32/deploying-a-mern-stack-web-app-with-docker-nginx-and-github-actions-on-aws-ec2)**
