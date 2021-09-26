const router = require('express').Router()
const multer = require('multer');
const File = require('../models/file')
const {v4:uuid4} = require('uuid')
const path = require('path')

let storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName= `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)} }`
    cb(null,uniqueName)
    }
})

let upload = multer({
    storage:storage,
    limits:{fieldSize:100000*100}
}).single('myfile')

router.post('/',(req,res)=>{
    upload(req,res,async(err)=>{
        if(!req.file){
            return res.status(404).json({
                status:false,
                message:"select a file"
            })
        }
        if(err){
            return res.status(500).send({error:err.message})
        }
        const file = new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size
        });
        const response = await file.save();
        return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
    });

});

router.post('/send',async(req,res)=>{
    try{
        const {uuid,emailTo,emailFrom}= req.body;
        //validate request
        if(!uuid || !emailTo || !emailFrom){
            return res.status(422).send({err:'All fields are required.'})
        }
        const file = await File.findOne({uuid:uuid})
            if(file.sender){
    
                return res.status(422).send({error:'Email already sent.'});
            }
            file.sender = emailFrom;
            file.receiver= emailTo;
            const response = await file.save();
            
    
            const sendMail = require('../services/emailServices')
            sendMail({
                from:emailFrom,
                to:emailTo,
                subject:'file Sharing',
                text:`${emailFrom} shared a file with you.`,
                html:require('../services/emailTemplate')({
                    emailFrom:emailFrom,
                    downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
                    size:parseInt(file.size/1000)+'KB',
                    expires:'24 hours'
    
                })
            })
            return res.send({successs:true})

    }catch(e){
        return res.status(401).json({
            status:false,
            message:e.message
        })

    }

      

})


module.exports = router