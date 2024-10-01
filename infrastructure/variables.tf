variable "APP_NAME" {
  type    = string
  default = "monza-tldrlw"
}

variable "IMAGE_TAG" {
  type = string
  # not having a default will force me to provide the latest image tag when running terraform locally
  default = "fb805b"
  # gets passed in from .github/workflows/infrastructure.yaml
}

variable "ENV" {
  type    = string
  default = "dvm"
  # not being used anywhere as of 9/29/24
  # as of 9/30/24, "dvm" also gets passed in from .github/workflows/infrastructure.yaml
}

variable "HOSTNAME" {
  type    = string
  default = "monza.tldrlw.com"
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

variable "REGION" {
  type    = string
  default = "us-east-1"
}

variable "LAMBDA_PATH" {
  type    = string
  default = "lambda"
}
