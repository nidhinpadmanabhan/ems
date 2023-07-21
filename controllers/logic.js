const employees = require("../models/emsSchema");
// logic to register new employees

exports.employeeRegister = async (req, res) => {
    // req.file
    const file = req.file.filename
    const { fname, lname, email, gender, phn, mobile, status, location } = req.body
    if (!fname || !lname || !email || !gender || !phn || !mobile || !status || !location || !file) {
        req.status(403).json("all inputs are required")
    }

    try {
        const preEmployee = await employees.findOne({ email })
        if (preEmployee) {
            res.status(403).json("employee already exist")
        }
        else {
            const newEmployee = new employees({
                fname, lname, email, phn, gender, status, profile: file, location, mobile
            })
            await newEmployee.save()
            res.status(200).json(newEmployee)
        }
    }
    catch (error) {
        res.status(401).json(error)
    }

}

// logic to get all employees
exports.getAllEmployees = async (req, res) => {

    // access query parameter from req
    const searchKey = req.query.search
    // create regular expression to match with fname
    const query = {
        fname: { $regex: searchKey, $options: "i" }       // "i"=case-insensitive
    }

    try {
        const allEmployees = await employees.find(query)
        res.status(200).json(allEmployees)
    }
    catch (err) {
        res.status(401).json(err)
    }

}

// logic to get profile
exports.getProfile = async (req, res) => {
    const { id } = req.params

    // find user in db
    try {
        const preuser = await employees.findOne({ _id: id })
        res.status(200).json(preuser)
    }
    catch {
        res.status(401).json("employee not exist")
    }
}

exports.deleteEmployee = async (req, res) => {
    const { id } = req.params

    // remove and get deleted response as object
    try {
        const removedItem = await employees.findByIdAndDelete({ _id: id })
        res.status(200).json(removedItem)
    }
    catch {
        res.status(401).json("employee not presant")
    }
}

// logic to edit employee
exports.editUser= async(req,res)=>{
    const {id}=req.params
    const { fname, lname, email, gender, phn, mobile, status, location,user_profile } = req.body
    const file = req.file?req.file.filename:user_profile

    try{
        const user=await employees.findOne({_id:id})
        if(user){
            user.fname=fname
            user.lname=lname
            user.email=email
            user.phn=phn
            user.mobile=mobile
            user.gender=gender
            user.status=status
            user.location=location
            user.profile=file

            await user.save()
            res.status(200).json(fname)
        }
    }
    catch(error){
        res.status(401).json(error)
    }
}