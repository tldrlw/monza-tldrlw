resource "aws_dynamodb_table" "insights" {
  name         = "${var.APP_NAME}-insights"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK" # Partition key (unique identifier for the message)
  # Define table attributes
  attribute {
    name = "PK"
    type = "S"
  }
  tags = {
    Name = "${var.APP_NAME}-insights"
  }
}

resource "aws_dynamodb_table" "constructors" {
  name         = "${var.APP_NAME}-constructors"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK" # Partition key (unique identifier for the message)
  # Define table attributes
  attribute {
    name = "PK"
    type = "S"
  }
  tags = {
    Name = "${var.APP_NAME}-constructors"
  }
}

resource "aws_dynamodb_table" "drivers" {
  name         = "${var.APP_NAME}-drivers"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK" # Partition key (unique identifier for the message)
  # Define table attributes
  attribute {
    name = "PK"
    type = "S"
  }
  tags = {
    Name = "${var.APP_NAME}-drivers"
  }
}

resource "aws_dynamodb_table" "results" {
  name         = "${var.APP_NAME}-results"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK" # Partition key (unique identifier for the message)
  # Define table attributes
  attribute {
    name = "PK"
    type = "S"
  }
  tags = {
    Name        = "${var.APP_NAME}-results"
    Description = "sprints-and-races"
  }
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table
# best `billing_mode` for dydb: https://www.reddit.com/r/aws/comments/pdsqy5/dynamodb_pricing_model_question_free_tier/

resource "aws_dynamodb_table" "standings_compute_test" {
  name         = "${var.APP_NAME}-standings-compute-test"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK" # Partition key (unique identifier for the message)
  # Define table attributes
  attribute {
    name = "PK"
    type = "S"
  }
  tags = {
    Name = "${var.APP_NAME}-standings-compute-test"
  }
}
