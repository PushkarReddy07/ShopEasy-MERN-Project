class APIFunctionality{
    // #query;
    // #queryStr;
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword ,
                $options:"i"
            }
        } : {}
        // console.log({...keyword});
        // console.log(keyword);
        // console.log({keyword});
        this.query = this.query.find({...keyword})
        return this
    } 
    filter(){
        const queryCopy = {...this.queryStr};
        const removeFields = ["keyword" , "page" , "limit"];
        removeFields.forEach(key => delete queryCopy[key]);
        this.query = this.query.find(queryCopy)
        return this
    }
    pagination(resultsPerPage){
        // console.log(resultsPerPage)
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultsPerPage * ( currentPage - 1 ) 
        this.query = this.query.limit(resultsPerPage).skip(skip)
        return this
    }
}
export default APIFunctionality;