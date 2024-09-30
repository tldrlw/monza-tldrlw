variable "APP_NAME" {
  type    = string
  default = "monza-tldrlw"
}

output "TF_VAR_APP_NAME" {
  value = var.APP_NAME
}

variable "IMAGE_TAG" {
  type = string
  # not having a default will force me to provide the latest image tag when running terraform locally
  default = "c43ca8b"
}

output "TF_VAR_IMAGE_TAG" {
  value = var.IMAGE_TAG
}

variable "ENV" {
  type    = string
  default = "dvm"
  # not being used anywhere as of 9/29/24
}

output "TF_VAR_ENV" {
  value = var.ENV
}

variable "HOSTNAME" {
  type    = string
  default = "monza.tldrlw.com"
}

output "TF_VAR_HOSTNAME" {
  value = var.HOSTNAME
}

variable "BLOG_TLDRLW_ALB" {
  type = object({
    arn  = string
    name = string
  })
  default = {
    arn  = "arn:aws:elasticloadbalancing:us-east-1:920394549028:loadbalancer/app/blog-tldrlw/15b9d345a3c0b2df"
    name = "blog-tldrlw"
  }
}

variable "BLOG_TLDRLW_ALB_SG_ID" {
  type    = string
  default = "sg-07507bc51908ada43"
}

variable "TARGET_GROUP" {
  type = object({
    arn  = string
    name = string
  })
  default = {
    arn  = "arn:aws:elasticloadbalancing:us-east-1:920394549028:targetgroup/monza-tldrlw-tg/85e222105b2d8b48"
    name = "monza-tldrlw-tg"
  }
}

variable "BLOG_TLDRLW_VPC_ID" {
  type    = string
  default = "vpc-08a677394c24de810"
}

variable "BLOG_TLDRLW_ECS_CLUSTER_NAME" {
  type    = string
  default = "main"
} 
