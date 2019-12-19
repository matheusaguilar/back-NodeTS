const fs = require('fs');
const multer  = require('multer');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const upload = multer();

const FILE_BODY_PATTERN = 'uppy_uploader_file_';
const STORE_IMG_PATH = './dist/assets/users/img/'

class FileUploadService{
    
    /**
     * return multer object
     */
    getUpload(){
        return upload;
    }

    /**
     * search in body all items named with fileUpload pattern
     * @param {*} body 
     */
    retrieveFiles(body){
        var files = [];

        for(var prop in body){
            if (prop.includes(FILE_BODY_PATTERN)){
                files.push(body[prop]);
            }
        }

        return files;
    }

    /**
     * store data img in path with unique name.
     * @param {*} imgData 
     * @param {*} uniqueName 
     */
    async storeImage(imgData, uniqueName){
        return new Promise(async (resolve, reject) => {
            var string = imgData;
            var regex = /^data:.+\/(.+);base64,(.*)$/;
            var matches = string.match(regex);
            var ext = matches[1];
            var data = matches[2];
            
            var buffer = Buffer.from(data, 'base64');
        
            var timestamp = new Date().getTime();
            var name = timestamp + '_' + uniqueName;

            var file = await imagemin.buffer(buffer, {
                plugins: [
                    imageminMozjpeg()
                ]
            });
        
            const fullFileName = STORE_IMG_PATH + name + '.' + ext;
            fs.writeFile(fullFileName, file, (err) => {
                if (!!err){
                    reject();
                }

                resolve(fullFileName.replace('./dist', ''));
            });
        })
    }
    
}

module.exports = new FileUploadService();