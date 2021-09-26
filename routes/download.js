const router = require('express').Router();
const file = require('../models/file');
const File= require('../models/file')

router.get('/:uuid',async(rq,res)=>{
    const file = await File.findOne({uuid:require.param})
    if(!file){
        return res.render('download',{error:'Link has been expired'})
    }
    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);

})
module.exports = router