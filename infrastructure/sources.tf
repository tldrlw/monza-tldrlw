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
