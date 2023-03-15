import Category from '../models/category.js';
import slugify from 'slugify';


const createCategories = async(req, res) =>{
    try {

        const {name} = req.body;

        if(!name.trim()){
            return res.json({
                error: "Name is required"
            })
        }

        //check if category exists
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(400).json({
                error: `Category ${name} already exists`
            });
        }
        
        //create slug
        const slug = slugify(name);

        const category = await new Category({name, slug});
        category.save();

        res.json(category)

    } catch (error) {
        console.log(error);

        return res.status(400).json(error)
    }
}

const getCategories = async(req, res) =>{
    try {
        const categories = await Category.find();

        if(!categories){
            return res.status(400).json({message: 'No categories found'})
        }

        res.json(categories)
    } catch (error) {
        console.log(error)
        res.json({
            error: 'Unable to obtain categories', error
        })
    }
};

const getCategory = async(req, res) =>{
    try {
        const categoryName = req.params.id;    

        const category = await Category.findOne({slug: categoryName});

        if(!category){
            return res.status(400).json({
                error: `Category ${categoryName} does not exist`
            });
        }

        res.json(category)

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Unable to obtain category'
        })
    }    
}

const updateCategory = async(req, res) =>{
    try {
        const categoryName = req.params.id;    
        const category = await Category.findOne({slug: categoryName});
        const {name} = req.body;

        //validate if name is not empty
        if(!name){
            res.status(400).json({
                error: 'Name is required'
            })
        }

           //checking if params exists (existing slug)
           if(!category){
            return res.status(400).json({
                error: `Category ${categoryName} does not exist`
            });
        }

        //checking duplicate category
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(400).json({
                error: `Category ${name} already exists`
            });
        }
     

    const updatedCategory = await Category.findOneAndUpdate({slug: categoryName},{name, slug: slugify(name)}, {new: true} );

    res.json(updatedCategory)

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Unable to update category'
        })
    }

}

const removeCategory = async(req, res) =>{
    try {

        const categoryName = req.params.id;    
        const category = await Category.findOne({slug: categoryName});
        
        if(!category){
            return res.status(400).json({
                error: `Category ${categoryName} does not exist`
            });
        }

        await Category.findOneAndDelete({slug: categoryName}, {new: true});

        res.json({message: 'Category has been deleted'})

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Unable to delete category'
        });
    }
}

export{
    createCategories,
    getCategories,
    getCategory,
    updateCategory,
    removeCategory
}