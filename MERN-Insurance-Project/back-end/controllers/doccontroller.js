const Document = require('../models/Document');
const Employee = require('../models/Employee');

// Upload KYC Documents
const uploadDocument = async (req, res) => {
    const { documentType, userId } = req.body;
    const documentUrl = req.file.location;  // Assuming you're using AWS S3 for file uploads

    try {
        // Save the new document
        const newDocument = new Document({
            userId,
            documentType,
            documentUrl,
            status: 'Submitted'  // Default status when uploaded
        });

        await newDocument.save();

        // Push the new document ID to the employee's 'documents' array
        await Employee.findByIdAndUpdate(userId, {
            $push: { documents: newDocument._id }
        });

        res.status(200).json({ message: 'Document uploaded successfully', newDocument });
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Error uploading document', error });
    }
};

const uploadReplacement = async (req, res) => {
    const { documentType, userId } = req.body;
    const documentUrl = req.file.location;

    try {
        // Check if the document already exists for the user and document type
        const existingDocument = await Document.findOne({ userId, documentType });

        if (existingDocument) {
            // Delete the existing document from the database (not from S3)
            await Document.deleteOne({ _id: existingDocument._id });
        }

        // Save the new document
        const newDocument = new Document({
            userId,
            documentType,
            documentUrl,
        });

        await newDocument.save();

        // Now, update the employee's documents array
        await Employee.findByIdAndUpdate(userId, {
            $push: { documents: newDocument._id }
        });

        res.status(200).json({ message: 'Documents submitted successfully', documentUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading document', error });
    }
};

module.exports = {
    uploadDocument,
    uploadReplacement
};
