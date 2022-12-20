import AWS from "aws-sdk";

function ImgDelete (file) {
    console.log("삭제하러 왔어요~", file);

    const region = "";
    const bucket = "";
    const accessKeyId = "";
    const secretAccessKey = "";


    const s3 = new AWS.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region,
    });

    s3.deleteObject(
        {
            Bucket: bucket,
            Key: `${file}`,
        },
        async (err, data) => {
            console.log("data : ", data);
            if(err){
                console.log(err);
            }
        }
    )


}

export default ImgDelete;