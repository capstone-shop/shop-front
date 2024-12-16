import AWS from "aws-sdk";

//  =========================== AWS 설정 ===========================

if (process.env.REACT_APP_AWS_REGION != undefined) {
    AWS.config.update({
        region: process.env.REACT_APP_AWS_REGION, // 버킷이 존재하는 리전 (Ex. "ap-northeast-2")
        secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID
    })
}

export default async function uploadS3(file: File, prevUrls: string[]): Promise<string> {
    // 이전에 업로드한 파일인지 확인함. 이미 업로드 했으면 이전에 올린 url 반환
    for (let url in prevUrls)
        if (url.includes(file.name))
            return url;

    if (process.env.REACT_APP_BUCKET_NAME == undefined)
        return "";

    // 파일명 만들기
    let filename = `${Date.now()}_${file.name}`;
    let bucket = process.env.REACT_APP_BUCKET_NAME ?? "";
    let region = process.env.REACT_APP_AWS_REGION ?? "";
    let url = `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;

    // 파일 업로드 관련 설정
    const uplaodSettings = {
        params: {
            Bucket: bucket, // 업로드할 대상 버킷명
            Key: filename, //업로드할 파일 이름(확장자 포함)
            Body: file, // 업로드할 파일 객체
        },
    }

    // 업로드 시작
    await new AWS.S3.ManagedUpload(uplaodSettings).promise();

    return url;
}