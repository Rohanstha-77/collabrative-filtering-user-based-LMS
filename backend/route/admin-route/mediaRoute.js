import e from "express"
import multer from "multer"
import {UploadMeida, deleteMedia} from "../../helpers/cloudnery.js"

const router = e.Router()

const upload = multer({dest:"upload/"})

router.post("/upload",upload.single('file'), async(req,res) => {
    try {
        const result = await UploadMeida(req.file.path)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "error uploading video"
        })
    }
})
router.delete("/delete/:id", async(req,res) => {
    try {
        const {id} =req.params
        console.log(id)

        if(!id) return res.status(400).json({success: false, message:"Id is required"})
        await deleteMedia(id)
        // res.status(200).json({
        //     success: true,
        //     data: result
        // })

        res.status(200).json({
            success: true,
            message: "Assests delete from cloud"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "error delteing video"
        })
    }

})

router.post('/bulkupload', upload.array('files',10),async(req,res) => {
    try {
        const uploadPromise = req.files.map(fileItems => UploadMeida(fileItems.path))
        const result= await Promise.all(uploadPromise)

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log("bulk upload error", error)
        res.status(500).json({
            success: false,
            message: "Error while uploading media in bulk"
        })
    }
})

export default router