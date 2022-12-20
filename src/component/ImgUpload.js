import React, {useEffect, useState} from "react";
import AWS from "aws-sdk";
import { v1, v3, v4, v5} from 'uuid';
import S3 from 'react-aws-s3';

function ImgUpload( file, name ) {
    const region = "";
    const bucket = "";
    const accessKeyId = "";
    const secretAccessKey = "";
    const fileName = v1().toString().replace("-", "");


    const s3 = new AWS.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region,
    });

    const uploadParams = {
        Bucket: bucket,
        Body: file,
        Key: `${fileName}`,
        ContentType: file.type,
        ACL: "public-read",
    };

    console.log("보내기전");
    s3.putObject(uploadParams, (err, data) => {
        console.log("에러" ,err);
        console.log(data);
        console.log("파일 이름1",fileName);
    });
    console.log("보낸후");
    console.log("파일 이름2",fileName);
    return fileName;
}

export default ImgUpload;