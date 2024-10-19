const Document = require('../models/Document.js');
const Employee = require('../models/Employee');
const sendEmail = require('./email.js');

const asyncHandler = require('express-async-handler');

// Controller to fetch all documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('userId', 'name');
//    const documents = await Document.find().populate('userId', 'name');
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

const updateDocumentStatus = async (req, res) => {
  const { id } = req.params; // Document ID
  const { status, rejectionReason } = req.body;

  try {
    // Update the document's status and rejection reason if provided
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { 
        status, 
        rejectionReason: status === 'Rejected' ? rejectionReason : '' // Set rejectionReason only if rejected
      },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Find the employee associated with the document (assuming userId links to Employee)
    const employee = await Employee.findById(updatedDocument.userId).populate('documents');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Fetch all related documents of the employee (assuming userId is foreign key linking documents to employee)
    const allDocuments = await Document.find({ userId: updatedDocument.userId });

    // Categorize KYC documents (id proof, address proof)
    const kycDocuments = allDocuments.filter(doc => doc.documentType === 'Id Proof' || doc.documentType === 'Address Proof');
    
    // Non-KYC documents (med records, fin records, etc.)
    const nonKycDocuments = allDocuments.filter(doc => doc.documentType !== 'Id Proof' && doc.documentType !== 'Address proof');

    /** KYC Status Update Logic **/
    // Only update KYC status if the document is of type 'id proof' or 'address proof'
    if (updatedDocument.documentType === 'Id Proof' || updatedDocument.documentType === 'Address Proof') {
      let kycStatus = 'Submitted'; // Default status

      const hasRejectedKYC = kycDocuments.some(doc => doc.status === 'Rejected');
      const hasInReviewKYC = kycDocuments.some(doc => doc.status === 'In Review');
      const allApprovedKYC = kycDocuments.every(doc => doc.status === 'Approved');

      // Determine KYC status based on KYC documents
      if (hasRejectedKYC) {
        kycStatus = 'Rejected';
        // Add email sending logic here for rejection
      } else if (allApprovedKYC) {
        kycStatus = 'Approved';
        // Add email sending logic here for approval
      } else if (hasInReviewKYC) {
        kycStatus = 'Pending';
      } else {
        kycStatus = 'Pending'; // Default if no review/rejected status
      }

      // Update the employee's KYC status
      employee.kycStatus = kycStatus;
      await employee.save().then( async () => {const emailSubject = `KYC Status Update`;
      const emailBody = `Hello ${employee.name},\n\nYour ${updatedDocument.documentType} has been "${status}. Kindly Proceed to the next steps\n \nKeep Saving. \n\n -InsuPort`;
      await sendEmail(employee.email, emailSubject, emailBody);
      employee.notifications.push({message: `Your ${updatedDocument.documentType} has been ${status}.`,
        type: 'KYC',createdAt: new Date()});
      await employee.save();});
    }
    
    if (updatedDocument.documentType === 'Financial Records' || updatedDocument.documentType === 'Medical Records' || updatedDocument.documentType === 'Other Records') {
    /** Non-KYC Status Update Logic **/
    // Non-KYC documents like med records or fin records will update docStatus only

    const hasRejectedDoc = nonKycDocuments.some(doc => doc.status === 'Rejected');
    const hasInReviewDoc = nonKycDocuments.some(doc => doc.status === 'In Review');
    const allApprovedDoc = nonKycDocuments.every(doc => doc.status === 'Approved');

    // Determine KYC status based on KYC documents
    if (hasRejectedDoc) {
      docStatus = 'Rejected';
      // Add email sending logic here for rejection
    } else if (allApprovedDoc) {
      docStatus = 'Approved';
      // Add email sending logic here for approval
    } else if (hasInReviewDoc) {
      docStatus = 'Pending';
    } else {
      docStatus = 'Pending'; // Default if no review/rejected status
    }


    // Update the employee's docStatus
    employee.docStatus = docStatus;
    await employee.save().then( async () => {const emailSubject = `Additional Documents Review Update`;
      const emailBody = `Hello ${employee.name},\n\nYour ${updatedDocument.documentType} have been "${status}". Please wait for further steps.\nKeep Saving. \n\n -InsuPort`;
      await sendEmail(employee.email, emailSubject, emailBody);
      employee.notifications.push({message: `Your ${updatedDocument.documentType} have been ${status}.`,
        type: 'Document',createdAt: new Date()});
      await employee.save(); });;
      }
    
    res.status(200).json({ updatedDocument, kycStatus: employee.kycStatus, docStatus: employee.docStatus });
  } catch (error) {
    console.error('Error updating document or employee KYC status:', error);
    res.status(500).json({ message: 'Error updating document or employee KYC status', error });
  }
};


const getEmployees = async (req, res) => {
  try {
      const employees = await Employee.find().populate('documents');  // Populates the documents field
      res.status(200).json(employees);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching employees', error });
  }
};

const getEmployeesById = async (req, res) => {
  const { id } = req.params;

  try {
      const employee = await Employee.findById(id).populate('documents'); // Populates the documents field

      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json(employee);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving employee', error });
  }
};







  const updatePolicyStatus = async (req, res) => {
    const { id } = req.params;
    const { policyStatus } = req.body;
  
    try {
      const employee = await Employee.findById(id);
  
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      employee.policyStatus = policyStatus;
      await employee.save();

      const emailSubject = `Policy Status Update`;
      const emailBody = `Hello ${employee.name},\n\nYour policy has recently been "${policyStatus}". Please visit our website if you have any queries.\nKeep Saving. \n\n -InsuPort`;
      //await sendEmail(employee.email, emailSubject, emailBody); 

      employee.notifications.push({
        message: `Your Policy is now ${policyStatus}.`,
        type: 'Policy',
        createdAt: new Date()
      });
      await employee.save();
    
      res.status(200).json({ message: 'Policy status updated successfully', policyStatus });
    } catch (error) {
      res.status(500).json({ message: 'Error updating policy status', error });
    }
  };
  
  

module.exports = {
  getDocuments,
  updateDocumentStatus,
  getEmployees,
  getEmployeesById,
  updatePolicyStatus
};
