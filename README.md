# overland-website
Overland Science Website


## Amazon Setup

1. Get your AWS keys
2. Create S3 bucket
3. Create SSL Certificates 
4. Create CloudFront distribution


### Get your AWS keys

1. Generate AWS access key and secret access key
2. Edit ~/.aws/config; set keys for overland profile, i.e.
	```[profile overland]
	region = us-west-2
	aws_access_key_id = AKIATXSZCM4NT2LEPI2B
	aws_secret_access_key = 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
	```


### Create S3 bucket

1. Open S3 Management Console
2. Tap "Create bucket"
	a. Bucket name: www.overlandscience.com
	b. Region: US West (Oregon)
	c. Click "Next" screen...
	d. Properties, click "Next" screen...
	e. Uncheck "Block all public access"
	f. Click "Next"
	g. "Create Bucket"
3. Tap on new bucket to edit settings
4. Create Bucket Policy
	a. Click Permissions tab
	b. Click Bucket Policy and paste in:
		```{
		  "Version": "2008-10-17",
		  "Statement": [
		    {
		      "Sid": "AllowPublicRead",
		      "Effect": "Allow",
		      "Principal": {
		        "AWS": "*"
		      },
		      "Action": [
		        "s3:GetObject"
		      ],
		      "Resource": [
		        "arn:aws:s3:::www.overlandscience.com/*"
		      ]
		    }
		  ]
		}
		```
	c. Save Bucket Policy
5. Set up Static Website Hosting
	a. Click Properties tab
	b. Click Static Website Hosting
	c. Check "Use this bucket to host a website"
	d. Set index document to index.html
	e. Set error document to 404.html


### Create SSL Certificates

1. Use the CertificateManager
2. Create certificates for *.overlandscience.com and overlandscience.com in both US-East 1 (Virginia) and US-West 2 (Oregon)



### Create Cloudfront Distribution

1. Open Cloudfront Console
2. "Create Distribution"
3. For Web, click "Get Started"
4. Origin domain name: www.overlandscience.com.s3-website-us-west-2.amazonaws.com/
5. Custom SSL Certificate: overlandscience.com
6. Default root object: index.html
7. Alternate domain names: www.overlandscience.com overlandscience.com
8. Click "Create"
9. Copy Domain name for Cloudfront distribution: i.e. d1cdi5jamn7rl4.cloudfront.net


### Setup Route53 for both www and naked domain

1) Create an A record:
  - empty name
  - Type: A record
  - Alias: Yes
  - Alias target: xyz...cloudfront.net

2) Create a CNAME record:
 - Name: www
 - Type: CNAME
 - Alias: No
 - Value: xyz...cloudfront.net
