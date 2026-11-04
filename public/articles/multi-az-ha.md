# Multi-AZ Three-Tier Architecture

## VPC

| Setting | Value |
| --- | --- |
| Name tag | `app-vpc` |
| IPv4 CIDR block | `10.0.0.0/16` |
| Region | `ap-southeast-1` |

### Subnets

#### Public subnet — AZ1

- **VPC:** `app-subnet`
- **Subnet name:** `app-public-subnet-az1`
- **Availability zone:** `ap-southeast-1a`
- **IPv4 VPC CIDR block:** `10.0.1.0/24` (256 IPs)

#### Private subnet — AZ1

- **VPC:** `app-subnet`
- **Subnet name:** `app-private-subnet-az1`
- **Availability zone:** `ap-southeast-1a`
- **IPv4 VPC CIDR block:** `10.0.2.0/24` (256 IPs)

#### Public subnet — AZ2

- **VPC:** `app-subnet`
- **Subnet name:** `app-public-subnet-az2`
- **Availability zone:** `ap-southeast-1b`
- **IPv4 VPC CIDR block:** `10.0.3.0/24` (256 IPs)

#### Private subnet — AZ2

- **VPC:** `app-subnet`
- **Subnet name:** `app-private-subnet-az2`
- **Availability zone:** `ap-southeast-1b`
- **IPv4 VPC CIDR block:** `10.0.4.0/24` (256 IPs)

### Internet Gateway

- **Name:** `app-igw`
- **VPC:** `app-vpc`

### Route Tables

#### Public route table

- **VPC:** `app-vpc`
- **Name:** `app-public-rt`

**Routes**

| Route | Destination | Target |
| --- | --- | --- |
| 1 | `10.0.0.0/16` | Local |
| 2 | `0.0.0.0/0` | `app-igw` (Internet gateway) |

**Subnet associations:** `app-public-subnet-az1`, `app-public-subnet-az2`

#### Private route table

- **VPC:** `app-vpc`
- **Name:** `app-private-rt`

**Routes**

| Route | Destination | Target |
| --- | --- | --- |
| 1 | `10.0.0.0/16` | Local |

**Subnet associations:** `app-private-subnet-az1`, `app-private-subnet-az2`

## Compute Architecture Design

### EC2 Launch Template

- **Purpose:** Auto Scaling Group launch template
- **Name:** `app-server-template`
- **AMI:** Amazon Linux 2023
- **Instance type:** `m6i.large`
- **EBS volume:** 20 GiB
- **Security groups:** `app-web-sg`, `app-db-sg`

### Elastic Load Balancer

#### Application Load Balancer

- **Type:** Application Load Balancer
- **Scheme:** Internet-facing
- **Name:** `app-alb`
- **IP address type:** IPv4
- **VPC:** `app-vpc`
- **Availability zones:** `ap-southeast-1a`, `ap-southeast-1b`
- **Subnets:** `app-public-subnet-az1`, `app-public-subnet-az2`
- **Security group:** `app-web-sg`
- **Listeners:** HTTP (80), HTTPS (443)
- **Target group:** `app-tg`

#### Target Group

- **Target type:** Instances
- **Target group name:** `app-tg`
- **Protocol:** HTTP (80)
- **VPC:** `app-vpc`
- **Healthy threshold:** 5
- **Unhealthy threshold:** 2
- **Timeout:** 5 seconds

### Auto Scaling Group

- **Name:** `app-asg`
- **Launch template:** `app-server-template`
- **VPC:** `app-vpc`
- **Availability zones and subnets:** `ap-southeast-1a` (`app-public-subnet-az1`), `ap-southeast-1b` (`app-public-subnet-az2`)
- **Load balancer target group:** `app-tg`
- **Desired capacity:** 2
- **Minimum capacity:** 1
- **Maximum capacity:** 4

## Database Architecture Design

### Subnet Group

- **Name:** `app-db-sbg`
- **VPC:** `app-vpc`
- **Availability zones:** `ap-southeast-1a`, `ap-southeast-1b`
- **Subnets:** `app-private-subnet-az1`, `app-private-subnet-az2`

### Database

- **Engine:** Aurora (MySQL Compatible)
- **Cluster scalability type:** Provisioned
- **Provisioned configuration:** `db.t3.large`
- **DB cluster identifier:** `app-database`
- **Multi-AZ deployment:** Aurora replica or reader in a different AZ
- **VPC:** `app-vpc`
- **DB subnet group:** `app-db-sbg`
- **Security group:** `app-db-sg`

### Database Backup Strategy

- **Backup retention period:** 30 days
- **Backup start time:** 00:00 UTC
- **Duration:** 20 hours

### S3 Bucket (Hosting)

- **Bucket type:** General Purpose
- **Namespace:** Global
- **Name:** `app-bucket-2367`
- **Public access:** Enabled
- **Versioning:** Enabled
- **Static website hosting:** Enabled

## Security

### Security Groups

#### `app-web-sg`

Security group for allowing web traffic.

- **VPC:** `app-vpc`
- **Inbound/outbound rules:** HTTP (Anywhere IPv4), HTTPS (Anywhere IPv4)

#### `app-db-sg`

Security group for secure database connections.

- **VPC:** `app-vpc`
- **Inbound/outbound rules:** MySQL/Aurora (only from `app-web-sg`)

#### `app-ssh-sg`

Security group for SSH access.

- **VPC:** `app-vpc`
- **Inbound rules:** SSH (from specified IPs)

### IAM Roles

#### Developer Access

Allows developers to see, start, and stop instances and update the static site on the allowed S3 bucket.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:StartInstances",
        "ec2:StopInstances"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::app-bucket-2367/*"
    }
  ]
}
```

#### Database Administrator Access

Allows database administrators to view and modify the selected database cluster and create, delete, and restore databases from snapshots.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:ModifyDBInstance",
        "rds:CreateDBSnapshot",
        "rds:DeleteDBSnapshot",
        "rds:RestoreDBInstanceFromDBSnapshot"
      ],
      "Resource": [
        "arn:aws:rds:ap-southeast-1:123456789012:db:app-database",
        "arn:aws:rds:ap-southeast-1:123456789012:snapshot:*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:DescribeDBSnapshots"
      ],
      "Resource": "*"
    }
  ]
}
```

## Elastic Load Balancing and High Availability Benefits

To achieve high availability, this architecture is designed to span two availability zones. If one zone goes down, resources and traffic can be redirected to the other availability zone.

The load balancer is configured to support these two availability zones. It sends web requests to the closest AZ to improve speed, performs health checks, and redirects traffic to another instance when one instance is not responding. Elastic load balancers also allow health-check parameters such as paths and intervals to be customized.

The Auto Scaling Group is configured with two desired instance capacities spanning two AZs and public subnets. It has a maximum of four instances to handle high traffic. If one instance goes down, the Auto Scaling Group launches another EC2 instance in an available availability zone to maintain high availability.

Aurora/MySQL is also configured to span two availability zones in private subnets in the database subnet group with Multi-AZ deployment. This service performs automatic failover routing, which also contributes to high availability.

An Application Load Balancer, Auto Scaling Group, and Aurora/MySQL database spanning two availability zones provide a highly available cloud architecture for this three-tier web application.

## Backup Strategy

### AWS Backup Service for S3 and EBS Volumes

- **Backup plan name:** `app-backup-35days`
- **Frequency:** Daily
- **Backup vault:** `automatic-backup-vault`
- **Backup window:** 01:00 Asia/Colombo (UTC+05:30)
- **Point-in-time recovery:** Enabled
- **Lifecycle:** Backups move to cold storage after 14 days and are removed after a total of 35 days

This backup rule applies to S3 storage and EBS snapshots. AWS Backup centralizes the backup options for these services and stores them securely in a vault, reducing backup complexity and management overhead.

### Aurora/MySQL Database Backup

Multi-AZ deployment keeps the main database and replica database synchronized. If the main database fails, the service fails over to the replica to maintain operations.

**Database backup strategy**

- **Backup retention period:** 30 days
- **Backup start time:** 00:00 UTC
- **Duration:** 20 hours
- **Point-in-time recovery:** Enabled

This backup strategy is configured when creating the database. If the database fails, a database administrator can use point-in-time recovery to restore the primary database and return it to operation while the application serves customers through the replica with zero downtime.

### EC2 Backups

EC2 backups are managed by the `app-backup-35days` backup plan. The plan manages a daily EBS snapshot cycle. If an instance fails, the Auto Scaling Group launches a new EC2 instance using the working launch template.

### S3 Backup

S3 versioning is enabled when the bucket is created. The backup cycle is managed by the AWS Backup service backup plan, and data can be recovered and restored at any point within 30 days.

## Monthly Cost Estimation

**AWS region:** Asia Pacific (Singapore)

### Load Balancer

- Load balancer: 0.0252 USD per hour × 730 hours per month = **18.40 USD**
- Processed bytes for 2 EC2 instances, 1 GB, average 10 new connections per second, average connection duration of 7 seconds, average 30 requests per second, and an average of 50 rules per request = **7.01 USD**
- **Total load balancer monthly cost: 25.41 USD**

### EC2 Instances

- Three `m6i.large` instances (estimated average) = **133.283400 USD**
- Three 20 GB gp3 EBS volumes with 3,000 IOPS and daily snapshots = **5.76 USD**
- Outbound data transfer, 50 GB per month = **12.00 USD**
- **Total EC2 monthly cost: 151.04 USD**

### Database

- Aurora/MySQL Compatible, 2 nodes (one primary and one standby), `db.t3.medium`, 80% monthly utilization, on-demand pricing = **147.17 USD**
- Storage, 200 GB, peak I/O rate of 50, peak hours per month of 25 = **23.55 USD**
- CloudWatch Insights = **36.50 USD**
- Backup storage, 200 GB = **4.60 USD**
- Backtrack = **1.30 USD**
- **Total Aurora/MySQL database monthly cost: 265 USD**

### S3

- Storage size of 5 GB, 200K GET/SELECT requests per month, and 100K PUT/COPY/POST/LIST requests = **1.43 USD**
- Outbound data transfer, 400 GB per month = **48 USD**
- **Total S3 monthly cost: 49.43 USD**

### Total Estimated Monthly Cost

**Total monthly billing cost for all services combined: 491.56 USD**

## Recommendations

- Tag resources in this project for better configuration and management.
- Configure CloudTrail to manage logs and SNS for notifications.
- Configure CloudFormation for one-click deployment and infrastructure version control.
