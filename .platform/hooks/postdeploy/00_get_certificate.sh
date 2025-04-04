#!/usr/bin/env bash
# Place in .platform/hooks/postdeploy directory
sudo certbot -n -d easyrent.eu-north-1.elasticbeanstalk.com --nginx --agree-tos --email erkebulan.duishenaliev@gmail.com
# http://easyrent.eu-north-1.elasticbeanstalk.com/