data "aws_lb" "blog_tldrlw" {
  arn  = var.BLOG_TLDRLW_ALB.arn
  name = var.BLOG_TLDRLW_ALB.name
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/lb

data "aws_lb_target_group" "main" {
  arn  = var.TARGET_GROUP.arn
  name = var.TARGET_GROUP.name
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/lb_target_group

data "aws_security_group" "blog_tldrlw_alb" {
  id = var.BLOG_TLDRLW_ALB_SG_ID
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/security_group

data "aws_vpc" "blog_tldrlw" {
  id = var.BLOG_TLDRLW_VPC_ID
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc

data "aws_subnets" "blog_tldrlw" {
  filter {
    name   = "vpc-id"
    values = [var.BLOG_TLDRLW_VPC_ID]
  }
  filter {
    name   = "tag:Name"  # Filters based on the Name tag
    values = ["public*"] # Matches subnets with names starting with 'public'
  }
  # ^ had to add this because creating private subnets in the VPC in this repo for λs to be in the VPC, VPC endpoint was picking up subnets in the same AZ instead of different ones before adding this filter
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnets

data "aws_ecs_cluster" "blog_tldrlw" {
  cluster_name = var.BLOG_TLDRLW_ECS_CLUSTER_NAME
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ecs_cluster

data "aws_route53_zone" "tldrlw_com" {
  name         = "tldrlw.com"
  private_zone = false
}

data "aws_acm_certificate" "monza_tldrlw_com" {
  domain   = "blog.tldrlw.com"
  statuses = ["ISSUED"]
}
# arn:aws:acm:us-east-1:920394549028:certificate/5963027a-2454-49e5-a335-a8e04b2df748
# monza.tldrlw.com is listed in the SANs
# ^ used in infrastructure/cloudfront-off-season.tf to force https

// cognito

# Retrieve the Cognito username from SSM Parameter Store
data "aws_ssm_parameter" "cognito_username_refayat" {
  name            = "/cognito/username/refayat" # Ensure the correct parameter name
  with_decryption = true                        # Decrypt SecureString value
}

# Retrieve the Cognito password from SSM Parameter Store
data "aws_ssm_parameter" "cognito_password_refayat" {
  name            = "/cognito/password/refayat" # Ensure the correct parameter name
  with_decryption = true                        # Decrypt SecureString value
}

data "aws_ssm_parameter" "cognito_username_ishaba" {
  name            = "/cognito/username/ishaba"
  with_decryption = true
}

data "aws_ssm_parameter" "cognito_password_ishaba" {
  name            = "/cognito/password/ishaba"
  with_decryption = true
}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_internet_gateway" "blog_tldrlw" {
  filter {
    name   = "attachment.vpc-id"
    values = [var.BLOG_TLDRLW_VPC_ID]
  }
}

data "aws_region" "current" {}
