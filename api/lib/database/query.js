const mongoose = require('mongoose')
const settings  = require('../../settings.js')

/*mongoose.connect(`mongodb+srv://${settings.DB_NAME}:${settings.DB_PASSWORD}@cluster0.rz4zi.mongodb.net/users`, {useNewUrlParser :true, useUnifiedTopology : true});*/
mongoose.connect(`mongodb://localhost:27017/userDetails`, {useNewUrlParser :true, useUnifiedTopology : true});
mongoose.connection.once('open',function(){
  console.log('Database connected Successfully');
}).on('error',function(err){
  console.log('Error', err);
})

function findOne(collection, query, callback){
    var model = require(`../models/${collection}`)
    model.findOne(query)
    .then((result) => {
        if(result){
            return callback(null, true, result);
        }else{
            return callback(null, false, null);
        }
    }).catch((err) => {
        return callback(err, false, null);
    })
}

function find(collection, query, populat, callback){
    var model = require(`../models/${collection}`)
    model.find(query).populate(populat)
    .then((result) => {
        if(result){
            return callback(null, true, result);
        }else{
            return callback(null, false, null);
        }
    }).catch((err) => {
        return callback(err, false, null);
    })
}

function findOneAndUpdate(collection, query, updateParam, callback){
    var model = require(`../models/${collection}`)
    model.findOneAndUpdate(query, updateParam, {new:true, upsert:true})
    .then((result) => {
        return callback(null, true, result);
    }).catch((err) =>{
        return callback(err, false, null);
    })
}

function updateOne(collection,query,updateParam,newReturn,upsert,arrayFilter,callback) {
    var model = require(`../models/${collection}`);
    model.updateOne(query,updateParam,{new:newReturn,upsert:upsert,arrayFilters:arrayFilter})
    .then(result=>{
        return callback(null,true,result);
    }).catch(err=>{
        return callback(err,false,null)
    })
 }

function insert(data,callback) {
    data.save(function (err,saved) {
        if (err) {
            return callback(err,false,null)
        };
       return callback(null,true,saved);
    });
}

module.exports.findOne = findOne
module.exports.findAll = find
module.exports.findOneAndUpdate = findOneAndUpdate
module.exports.updateOne = updateOne
module.exports.insert = insert