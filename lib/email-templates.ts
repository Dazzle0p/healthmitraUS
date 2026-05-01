export const billReimbursementOpdTemplate = ({ customerName, amount, percentage, taxAmount }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>We have undergone investigations on the said refund of yours towards OPD charges. As per telephonic Conversation/Email with our Claims Team Member we are supposed to do a Refund of USD ${amount} towards service OPD Refund to your account.</p>
  <p>OPD cleared at ${percentage}%</p>
  <p>Request you to kindly use HealthMitra verified labs and Get between 30% to 50% Discount of tests.</p>
  <p>Please Send bills within 30 days of Bill being acquired. Bills older than the same will not be entertained.</p>
  <p>Prescriptions are required for Clearance of Medicine bills.</p>
  <p>Emails over 10 MB don’t reach us kindly break the email down in parts.</p>
  <p>We are in the meantime requesting you for details so that the partial service refund for the same may be initialized from our end towards Service Delivery.</p>
  
  <p><strong>Details Required:</strong></p>
  <p>In below mentioned Format ONLY and In the Columns Mentioned Below ONLY</p>
  <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <tr>
      <th>Name of customer as in Bank Account</th>
      <th>Name of Bank</th>
      <th>Routing Number / SWIFT Code</th>
      <th>Bank Account Number</th>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </table>
  <p>Also attached cheque copy as its mandatory now</p>
  <p>Sir, Bill clearance process usually takes 48 - 72 Working Hours at the maximum as per Our guidelines excluding Saturday and Sundays or national holidays. Request you to kindly revert back with the said details so that we may initiate refund as per our guidelines.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const billReimbursementTestTemplate = ({ customerName, amount, percentage, taxAmount }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>We have undergone investigations on the said refund of yours towards Diagnostic charges. As per telephonic Conversation/Email with our Claims Team Member we are supposed to do a Refund of USD ${amount} towards service Diagnostic Refund to your account.</p>
  <p>Diagnostics Tests cleared at ${percentage}% (kindly use our panel labs and get 30 to 50 % discount)</p>
  <p>kindly start using HealthMitra labs only from now on. Request you to kindly use HealthMitra verified labs and Get between 30% to 50% Discount of tests.</p>
  <p>Please Send bills within 30 days of Bill being acquired. Bills older than the same will not be entertained.</p>
  <p>Prescriptions are required for Clearance of Medicine bills.</p>
  <p>Emails over 10 MB don’t reach us kindly break the email down in parts.</p>
  <p>We are in the meantime requesting you for details so that the partial service refund for the same may be initialized from our end towards Service Delivery.</p>
  
  <p><strong>Details Required:</strong></p>
  <p>In below mentioned Format ONLY and In the Columns Mentioned Below ONLY</p>
  <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <tr>
      <th>Name of customer as in Bank Account</th>
      <th>Name of Bank</th>
      <th>Bank IFSC Code</th>
      <th>Bank Account Number</th>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </table>
  <p>Also attached cheque copy as its mandatory now</p>
  <p>Sir, Bill clearance process usually takes 48 - 72 Working Hours at the maximum as per Our guidelines excluding Saturday and Sundays or national holidays. Request you to kindly revert back with the said details so that we may initiate refund as per our guidelines.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const billReimbursementMedicineTemplate = ({ customerName, amount, percentage, taxAmount }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>We have undergone investigations on the said refund of yours towards Medicines charges. As per telephonic Conversation/Email with our Claims Team Member we are supposed to do a Refund of USD ${amount} towards service Medicines Refund to your account.</p>
  <p>Medicines Cleared at ${percentage}% (kindly use HealthMitra panel Pharmacy and get 30% discount)</p>
  <p>Request you to kindly use HealthMitra verified labs and Get between 30% to 50% Discount of tests.</p>
  <p>Please Send bills within 30 days of Bill being acquired. Bills older than the same will not be entertained.</p>
  <p>Prescriptions are required for Clearance of Medicine bills.</p>
  <p>Emails over 10 MB don’t reach us kindly break the email down in parts.</p>
  <p>We are in the meantime requesting you for details so that the partial service refund for the same may be initialized from our end towards Service Delivery.</p>
  
  <p><strong>Details Required:</strong></p>
  <p>In below mentioned Format ONLY and In the Columns Mentioned Below ONLY</p>
  <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <tr>
      <th>Name of customer as in Bank Account</th>
      <th>Name of Bank</th>
      <th>Bank IFSC Code</th>
      <th>Bank Account Number</th>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </table>
  <p>Also attached cheque copy as its mandatory now</p>
  <p>Sir, Bill clearance process usually takes 48 - 72 Working Hours at the maximum as per Our guidelines excluding Saturday and Sundays or national holidays. Request you to kindly revert back with the said details so that we may initiate refund as per our guidelines.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const billReimbursementVaccinationTemplate = ({ customerName, amount, percentage, taxAmount }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>We have undergone investigations on the said refund of yours towards Vaccination charges. As per telephonic Conversation/Email with our Claims Team Member we are supposed to do a Refund of USD ${amount} towards service Vaccination Refund to your account.</p>
  <p>Vaccinations cleared at ${percentage}%</p>
  <p>Request you to kindly use HealthMitra verified labs and Get between 30% to 50% Discount of tests.</p>
  <p>Please Send bills within 30 days of Bill being acquired. Bills older than the same will not be entertained.</p>
  <p>Prescriptions are required for Clearance of Medicine bills.</p>
  <p>Emails over 10 MB don’t reach us kindly break the email down in parts.</p>
  <p>We are in the meantime requesting you for details so that the partial service refund for the same may be initialized from our end towards Service Delivery.</p>
  
  <p><strong>Details Required:</strong></p>
  <p>In below mentioned Format ONLY and In the Columns Mentioned Below ONLY</p>
  <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <tr>
      <th>Name of customer as in Bank Account</th>
      <th>Name of Bank</th>
      <th>Bank IFSC Code</th>
      <th>Bank Account Number</th>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </table>
  <p>Also attached cheque copy as its mandatory now</p>
  <p>Sir, Bill clearance process usually takes 48 - 72 Working Hours at the maximum as per Our guidelines excluding Saturday and Sundays or national holidays. Request you to kindly revert back with the said details so that we may initiate refund as per our guidelines.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const billRejectedTemplate = ({ customerName, remarks }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>Bill not approved due to following reasons.</p>
  <p><strong>Remarks:</strong> ${remarks}</p>
  <p>Kindly resolve the same and re-upload the said bill if the issue highlighted from our end has been resolved by you.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const franchiseWelcomeTemplate = ({ franchiseName, userId, password }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Dear ${franchiseName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>We are Happy to welcome you to the HealthMitra Parivar.</p>
  <p>Following are your Login Credentials to Login into the CRM and Check sales done by you or your team.</p>
  <ul>
    <li><strong>User ID:</strong> ${userId}</li>
    <li><strong>Password:</strong> ${password}</li>
  </ul>
  <p>Link for Login is as follows.<br/><a href="https://www.healthmitraus.com">www.healthmitraus.com</a></p>
  <br/>
  <p>Regards,<br/><strong>Tech Team HealthMitra</strong></p>
</div>
`;

export const paymentApprovedMsgTemplate = ({ customerName }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>Kindly approve the payment approved from our end so that we may Credit the same into your E wallet.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const ewalletRedemptionToCustomerTemplate = ({ customerName, amount, transactionId }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>We have approved your request for USD ${amount} redemption into your bank account. The same will be credited to you within the next 72 working hours excluding Saturday and Sunday or any bank holidays.</p>
  <p>NEFT details are as follows: ${transactionId}</p>
  <p>Kindly ensure that you have updated your bank account correctly in the profile section of your CRM portal.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const ewalletRedemptionToAdminTemplate = ({ customerName, amount, requestId }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Redemption request for ${customerName} for request id ${requestId} of USD ${amount} has been received kindly clear the same within the next 72 working hours.</p>
  <br/>
  <p>Regards,<br/><strong>Admin team</strong></p>
</div>
`;

export const billUploadTimelineTemplate = ({ customerName }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>We have received your request for bill reimbursment. The same will be cleared to you within the next 72 working hours excluding Saturday and Sunday or any bank holidays.</p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Claims Team HealthMitra</strong></p>
</div>
`;

export const adminBillUploadedTemplate = ({ adminName, customerName, ticketId, type }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${adminName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>Kindly note ${customerName}, has uploaded a Bill via Ticket ID ${ticketId} for ${type} reimbursement. Kindly check and approve of the same.</p>
  <br/>
  <p>Regards,<br/><strong>Claims Team</strong></p>
</div>
`;

export const customerTicketUploadedTemplate = ({ customerName, type, ticketId }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>Kindly note the following a request for ${type} via Ticket ID ${ticketId} for service has been received. We will service you within the next 24 to 72 working hours or less.</p>
  <br/>
  <p>Regards,<br/><strong>Claims Team</strong></p>
</div>
`;

export const customerReimbursementRequestTemplate = ({ customerName, type, ticketId }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>Kindly note the following a request for reimbursement for ${type} via Ticket ID ${ticketId} for service has been received. We will service you within the next 72 working hours excluding Saturday or Sunday and national holidays.</p>
  <br/>
  <p>Regards,<br/><strong>Claims Team</strong></p>
</div>
`;

export const customerServiceApprovedTemplate = ({ customerName, type, ticketId, remarks }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${customerName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>Kindly note the following a request for ${type} via Ticket ID ${ticketId} for service has been approved.</p>
  ${remarks ? `<p>${remarks}</p>` : ''}
  <p>We will service you within the next 24 to 72 working hours or less.</p>
  <br/>
  <p>Regards,<br/><strong>Claims Team</strong></p>
</div>
`;

export const adminServiceApprovedTemplate = ({ adminName, customerName, type, ticketId, remarks }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected ${adminName},</p>
  <p>Greetings of the day from HealthMitra.</p>
  <p>Kindly note the following a request for ${type} via Ticket ID ${ticketId} for service has been approved for ${customerName}.</p>
  ${remarks ? `<p>${remarks}</p>` : ''}
  <p>Service will be done within the next 24 to 72 working hours or less.</p>
  <br/>
  <p>Regards,<br/><strong>Claims Team</strong></p>
</div>
`;

export const planPurchaseConfirmationTemplate = ({ customerName, userId, password, planName, transactionId, amount, partnerName }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Dear ${customerName},</p>
  <p>Greetings of the Day from HealthMitra.</p>
  <p>Your user id is <strong>${userId}</strong> and Password is <strong>${password}</strong> (do not share with anyone).</p>
  <p>Thank you for purchasing HealthMitra preventive healthcare membership <strong>${planName}</strong> for your family through our payment partner (${partnerName}) via transaction id (${transactionId}) for USD (${amount}).</p>
  <p>Below mentioned plan details are for your reference: ${planName}</p>
  <p>How to Use HealthMitra.co.in WebCRM: <a href="https://youtube.com/playlist?list=PLJ901-wtAm8ufH3GDhLxZOeb-zTfWBfCp&si=oOnp6JXsDw0JNLAb">Watch Playlist</a></p>
  <p>To start utilizing HealthMitra services immediately, please download your e-card(s) using above login details. You can print a copy of your e-card(s). For any further assistance, please call our helpdesk at 716-579-0346 (USA) or +91 9818823106 (India).</p>
  <p>Linked Herein are the <a href="https://HealthMitraus.com/Refund-Cancellation">Terms and Conditions for Refund and Cancellation</a> for the HealthMitra.co.in Plan.</p>
  <p><em>Validity of the E-card is viable until the validity date mentioned. For any further assistance, please call our helpdesk at 716-579-0346 or +91 9818823106.</em></p>
  <p><small>DISCLAIMER: This is an auto generated mail please do not reply to this email. In case you have any queries/clarifications, please email us at service@HealthMitraus.com or call our helpdesk at +91 9818823106 / 716-579-0346.</small></p>
  <br/>
  <p>Thanks and Regards,<br/><strong>Team HealthMitra</strong></p>
</div>
`;

export const planPurchaseWelcomeTemplate = ({ customerName, userId, password, planName, transactionId, amount }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Dear ${customerName},</p>
  <p>Greetings from HealthMitra!</p>
  <p>We are pleased to confirm your purchase of the HealthMitra Preventive Healthcare Membership - <strong>${planName}</strong>. Your transaction was successfully processed through our payment partner with Transaction ID: <strong>${transactionId}</strong> for USD <strong>${amount}</strong></p>
  
  <p><strong>Your Account Details:</strong></p>
  <ul>
    <li>User ID: ${userId}</li>
    <li>Password: ${password} (Please keep this information confidential)</li>
  </ul>
  
  <p><strong>How to Get Started:</strong></p>
  <ol>
    <li><strong>Download Your e-Card:</strong> Log in using the above credentials to download and print your e-card(s).</li>
    <li><strong>Explore WebCRM:</strong> Learn how to use HealthMitra’s WebCRM by watching our video tutorials.</li>
  </ol>
  
  <p>For any questions or further assistance, please don’t hesitate to reach out to our helpdesk at 716-579-0346 or +91 9818823106 between 8 AM and 8 PM.</p>
  <p>You can review the Terms and Conditions for Refund and Cancellation for your HealthMitra Plan at your convenience.</p>
  <p><small>Please note: This is an automated email; responses to this email are not monitored. For any inquiries, please contact us at service@HealthMitraus.com.</small></p>
  <p>Thank you for choosing HealthMitra. We are committed to supporting your family’s health and well-being.</p>
  <br/>
  <p>Best regards,<br/><strong>Team HealthMitra</strong></p>
</div>
`;

export const ewalletRefundInitiatedTemplate = ({ amount, utrNo, date }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Respected Customer,</p>
  <p>Greetings from HealthMitra.</p>
  <p>As communicated by our Claims Team, a HealthMitra Ewallet refund of USD ${amount} has been initiated and will be transferred to your account via UTR No. ${utrNo} from Bank of Baroda. Please note that it may take up to 3 working days for the payment to reflect in your account.</p>
  <p>The amount will be processed via NEFT by ${date}. We kindly request you to confirm once the payment has been credited to your account.</p>
  <p>For any further assistance, please feel free to contact us at 716-579-0346 or +91 9818823106 Or email us on service@HealthMitraus.com or Service@HealthMitra.co.in.</p>
  <p>Thank you for your patience and understanding.</p>
  <br/>
  <p>Best regards,<br/><strong>Customer Care Team HealthMitra</strong><br/>+91 9818823106 / 716-579-0346</p>
</div>
`;

export const ewalletRefundNotInitiatedTemplate = ({ customerName, amount }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Dear ${customerName || 'Customer'},</p>
  <p>Greetings from HealthMitra.</p>
  <p>We regret to inform you that your request for an Ewallet refund of USD ${amount} has not been initiated due to incorrect or missing bank details. To proceed with the refund, please correct the information and reapply for the Ewallet transfer.</p>
  <p>If you need any further assistance, please don't hesitate to contact us at +91 9818823106 or via email at Service@HealthMitra.co.in.</p>
  <p>We appreciate your patience and understanding.</p>
  <br/>
  <p>Best regards,<br/><strong>Customer Care Team HealthMitra</strong><br/>+91 9818823106</p>
</div>
`;

export const generateWhatsAppPurchaseMsg = (name: string, amount: string | number) => 
  `Dear ${name}, Thank you for purchasing your Preventive Health care Plan from HealthMitra, Using your Banking to pay for USD ${amount}. Regards HealthMitra 9818823106.`;

// NEW TEMPLATES FOR WALLET AND FORMS
export const walletTopUpSuccessTemplate = ({ customerName, amount, transactionId, newBalance }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <p>Dear ${customerName || 'Customer'},</p>
  <p>Greetings from HealthMitra.</p>
  <p>We have successfully received your payment of USD ${amount} towards your HealthMitra E-Wallet.</p>
  <p><strong>Transaction ID:</strong> ${transactionId}</p>
  <p>Your new E-Wallet balance is now: <strong>USD ${newBalance}</strong>.</p>
  <p>You can use your wallet balance to purchase services, book tests, and access premium medical consultations on our platform.</p>
  <br/>
  <p>Best regards,<br/><strong>HealthMitra Team</strong><br/>+91 9818823106</p>
</div>
`;

export const contactUsNotificationTemplate = ({ name, email, phone, message }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <h2>New Contact Us Form Submission</h2>
  <p>A new query has been submitted via the HealthMitra Get In Touch form:</p>
  <ul>
    <li><strong>Name:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
  </ul>
  <p><strong>Message:</strong></p>
  <p>${message}</p>
  <br/>
  <p>Please follow up with the user within 24 hours.</p>
</div>
`;

export const medicalConsultationRequestTemplate = ({ name, email, phone, specialty, date, preferredTime, symptoms }: any) => `
<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <h2>New Medical Consultation Request</h2>
  <p>A user has requested a medical consultation from their dashboard:</p>
  <ul>
    <li><strong>Patient Name:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Phone:</strong> ${phone}</li>
    <li><strong>Specialty Requested:</strong> ${specialty}</li>
    <li><strong>Preferred Date:</strong> ${date}</li>
    <li><strong>Preferred Time:</strong> ${preferredTime}</li>
  </ul>
  <p><strong>Symptoms/Notes:</strong></p>
  <p>${symptoms || 'None provided'}</p>
  <br/>
  <p>Please arrange the consultation and notify the user.</p>
</div>
`;
