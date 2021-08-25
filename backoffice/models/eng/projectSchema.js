const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurifier = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurifier(new JSDOM().window)

const reqString = {
    type: String,
    required: true
}
const reqBoolean = {
    type: Boolean,
    required: true
}

const projectSchema = new mongoose.Schema({
    title: reqString,
    description: reqString,
    markdown: reqString,
    github: reqString,
    link: reqString,
    cover: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    sanitizedHtml: reqString,
    published: reqBoolean
})



projectSchema.pre('validate', function(next){
    if(this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    if(this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

module.exports = mongoose.model('Projects', projectSchema)