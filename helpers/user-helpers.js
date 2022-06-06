var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { ObjectID } = require('bson')
var objectId=require('mongodb').ObjectID
const { response } = require('../app')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
        })
        
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("sucess");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("failed");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("login failed");
                resolve({status:false})
            }
        })

    },

    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                    {
                       
                            $push:{products:objectId(proId)}
                       
                    }
                ).then((response)=>{
                    resolve()
                })
            }else{
                let cartobj={
                    user:objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartobj).then((response)=>{
                    resolve()
                })
            }
        })
    }
   
}