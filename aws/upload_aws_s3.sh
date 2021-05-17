#!bin/sh
usage="$(basename "$0") [-h] [-p localpath] [-f filename] [-b bucket] [-r remotepath] -- program to put file into S3 bucket

where:
    -h  show this help text
    -p  local path value
    -f  filename
    -b  bucket name
    -r  remote path in S3 bucket
"
if [[ $# -eq 0 ]]
then
    echo "Error: No arguments specified." >&2
    echo "$usage"
    exit 0
fi

options=':hp:f:r:b:'

pflag=false
fflag=false
bflag=false
rflag=false

while getopts $options option
do
    case "$option" in
        h)  echo "$usage"
            exit
            ;;
        p)  pflag=true
            path=$OPTARG
            ;;
        :)  printf "Missing argument for -%s\n" "$OPTARG" >&2
            echo "$usage" >&2
            exit 1
            ;;
        f)  fflag=true
            file=$OPTARG
            ;;
        :)  printf "Missing argument for -%s\n" "$OPTARG" >&2
            echo "$usage" >&2
            exit 1
            ;;
        b)  bflag=true
            bucket=$OPTARG
            ;;
        :)  printf "Missing argument for -%s\n" "$OPTARG" >&2
            echo "$usage" >&2
            exit 1
            ;;
        r)  rflag=true
            aws_path=$OPTARG
            ;;
        :)  printf "Missing argument for -%s\n" "$OPTARG" >&2
            echo "$usage" >&2
            exit 1
            ;;
        \?) printf "Illegal option: -%s\n" "$OPTARG" >&2
            echo "$usage" >&2
            exit 1
            ;;
    esac
done

shift $((OPTIND - 1))

if ! $pflag
then
    echo "Error: Missing -p and argument. Local path must be specified." >&2
    echo "$usage" >&2
    exit 1
elif ! $fflag
then
    echo "Error: Missing -f and argument. Filename must be specified." >&2
    echo "$usage" >&2
    exit 1
elif ! $bflag
then
    echo "Error: Missing -b and argument. Bucket must be specified." >&2
    echo "$usage" >&2
    exit 1
elif ! $rflag
then
    echo "Error: Missing -r and argument. Remote path must be specified." >&2
    echo "$usage" >&2
    exit 1
fi

S3KEY=""
S3SECRET="" # constants

#path=$1
#file=$2
#aws_path=$3
#bucket=$4
date=$(date +"%a, %d %b %Y %T %z" -u)
acl="x-amz-acl:public-read"
content_type='application/gzip'
string="PUT\n\n$content_type\n$date\n$acl\n/$bucket$aws_path$file"
signature=$(printf "${string}" | openssl sha1 -hmac "${S3SECRET}" -binary | base64)
curl -k -X PUT -T "$path$file" \
    -H "Host: $bucket.s3.amazonaws.com" \
    -H "Date: $date" \
    -H "Content-Type: $content_type" \
    -H "$acl" \
    -H "Authorization: AWS ${S3KEY}:$signature" \
    "https://$bucket.s3.amazonaws.com$aws_path$file"
