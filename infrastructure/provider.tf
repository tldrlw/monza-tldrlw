terraform {
  backend "s3" {
    bucket         = "tfstate-tldrlw-monza"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tfstate-tldrlw-monza"
    encrypt        = true
  }
  # bucket and dydb table managed locally in /Users/refayathaque/tfstate
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40.0"
    }
  }
  required_version = ">= 1.7.4"
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      ManagedBy = "Terraform"
      Repo      = "https://github.com/tldrlw/monza-tldrlw/tree/main/infrastructure"
      App       = var.APP_NAME
    }
  }
}

provider "aws" {
  region = "us-west-2"
  alias  = "usw2"
  # oregon
  default_tags {
    tags = {
      ManagedBy = "Terraform"
      Repo      = "https://github.com/tldrlw/monza-tldrlw/tree/main/infrastructure"
      App       = var.APP_NAME
    }
  }
}

# list of all regions: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html
