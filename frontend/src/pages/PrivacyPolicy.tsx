import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="badge-hero mx-auto w-max mb-8">
              <span>🔒</span>
              <span>PRIVACY POLICY</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              Your Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Matters</span>
            </h1>
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your personal information and being transparent about how we collect, use, and share your data.
            </p>
          </div>
        </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg max-w-none">
            
            <div className="bg-edtech-blue/5 border border-edtech-blue/20 rounded-2xl p-6 mb-8">
              <p className="text-gray-800 font-medium mb-0">
                <strong>Last updated:</strong> January 2025
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. INTRODUCTION</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              EdTech Informative LLC (together with its subsidiaries, and international affiliates, hereinafter "EdTech Informative" "us," "we," or "our" or "the Company") is committed to the security and management of personal data of individuals (Personal Data), to function effectively and successfully for the benefit of our stakeholders, vendors, customers and for the community. In doing so, it is essential that people's privacy is protected through the lawful and appropriate means for handling Personal Data. Therefore, we have implemented this Privacy Policy (hereinafter referred to as ''Policy'').
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. AIM</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              This Policy aims to protect Personal Data of the various stakeholders connected to our organization. This Policy is aimed at providing individuals notice of the basic principles by which the company processes Personal Data who visits, uses, deals with and/or transacts through the website and includes a guest user and browser (hereinafter 'you', 'user').
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. PURPOSE AND SCOPE</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The purpose of this Policy is to describe how EdTech Informative collects, uses, and shares information about you through our online interfaces (e.g., websites) owned and controlled by us, including but not limited to https://www.edtechinformative.uk/ (hereinafter individually or collectively referred to "website"). This Policy is also designed to provide information on how EdTech Informative ensures data security, conducts data transfers and process requests from data subjects.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              This Policy control applies to all systems, people and processes that constitute the company's information systems, including board members, directors, employees and other third parties who have access to Personal Data available within EdTech Informative.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              The company is also committed to ensure that its employees conduct themselves in line with this, and other related, policies. Where third parties process Personal Data on behalf of EdTech Informative, the company endeavors to obtain assurances from such third parties that your Personal Data will be safeguarded consistently.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              EdTech Informative offers curated and specially designed industry-relevant certification and bootcamps programs online ("hereinafter individually or collectively referred to as Program"). This Policy applies to all our services unless specified otherwise.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. TYPES OF PERSONAL DATA COLLECTED</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Personal Data that we collect about you depends on the context of your interactions with us, the products, services and features that you use, your location, and the applicable laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Personal Data is stored in personnel files or within the electronic records (on servers in United States or other countries) of EdTech Informative. The following types of Personal Data may be held by EdTech Informative, as appropriate, on relevant individuals:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">A. Personal Identification Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>First Name, Last name</li>
              <li>Job title & Company</li>
              <li>Signature</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">B. Financial Data (Only of our Creditors)</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Bank Account information</li>
              <li>Salary Information</li>
              <li>Payment gateway account details</li>
              <li>E-wallet account details</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">C. Personal Characteristics</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Age</li>
              <li>Gender</li>
              <li>Date of Birth</li>
              <li>Marital Status</li>
              <li>Nationality</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">D. Contact Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Postal address</li>
              <li>Email address</li>
              <li>Phone number</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">E. Education and Recruitment Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Educational qualification(s)</li>
              <li>Working goals</li>
              <li>Post-qualification experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">F. Electronic Identification Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Login credentials (If you are a registered user)</li>
              <li>Visitors IP Data</li>
              <li>Date and time of website visit</li>
              <li>Pages visited and navigation on the website</li>
              <li>Browser being used</li>
              <li>County of accessing website</li>
              <li>Language of the browser being used</li>
              <li>Words searched for</li>
              <li>Pixel tags</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">G. Inquiries</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Personal Data stated in the form – for example: Name, address, phone number, country</li>
              <li>Subject of Inquiry</li>
              <li>Personal details (Name on the card, billing address)</li>
              <li>Payment details (card numbers, card type)</li>
              <li>Recordings of calls with professionals and users showing interest in our Program</li>
              <li>Information about your interactions with customer service and maintenance interactions with us</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">H. User Generated Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Projects and Assignments submitted</li>
              <li>Peer feedback and grading</li>
              <li>Program performance data</li>
              <li>Response to quizzes, standalone quizzes, exams, and surveys</li>
              <li>Web Cam Recordings (during assessments related to online programs)</li>
              <li>Posts made to public forums through our platform</li>
              <li>Any other information necessary to ensure conformity with test/ assessment rules, area of interests</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">I. Marketing Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Your preferences in receiving marketing information from us</li>
              <li>Your communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">J. Behavioural Data</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Data inferred or assumed information relating to your behavior and interests based on your online activity on our sites
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              We do not collect any payment information processed by third-party payment gateway providers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. SOURCES OF DATA COLLECTION</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Personal Data collected by EdTech Informative is derived directly from the data provided by the user or by use of our sites.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Collected when You:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Register for various seminars, webinars or any other outreach initiatives made available by us or Educational Partner's offline activities</li>
              <li>Request a quote for the various products and services offered by us</li>
              <li>Place a feedback, complete any customer surveys circulated or interact with our customer services online</li>
              <li>View our services or visit our website pages on the internet</li>
              <li>Browse our website</li>
              <li>When you appear for assignments, exams or any other assessments in relation to online course</li>
              <li>When you avail scholarships, refunds and referrals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Collected from third parties</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We receive Personal Data such as access or login details, profile picture or any other text / image in relation to your Personal Data which may be available with such third parties.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We also receive information about your visits to this platform and to other websites using pixel tags.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Third parties from whom we receive your Personal Data include, our service providers, other networks connected to our service, our advertising partners, our marketing and advertising affiliates, our educational partners, scholarship providers, analytics providers, recruiters and such other third-party sources.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. COOKIES</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">A. EdTech Informative uses cookies in a range of ways to improve your experience on our website, including:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>To recognize our website user and to enhance user experience when interacting with our website.</li>
              <li>We moreover use cookies to help us to analyse the use and performance of our website and services.</li>
              <li>We also use cookies to improve the delivery and value of various services and products offered by us.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">B. What types of cookies do we use?</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              There are a few different types of cookies, however, our website uses:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li><strong>Persistent Cookies.</strong> We use persistent Cookies to improve your experience of using the Sites. This includes recording your acceptance of our Cookie Policy to remove the cookie message which first appears when you use the Sites.</li>
              <li><strong>Session Cookies.</strong> Session Cookies are temporary and deleted from your machine when your web browser closes. We use session Cookies to help us track internet usage as described above.</li>
              <li><strong>Analytical/Performance Cookies.</strong> Analytical cookies allow us to recognize and count the number of visitors and see how many visitors move around our website while they are using it. This helps us improve the way our website works, for example, by ensuring the users find what they are looking for.</li>
              <li><strong>Functionality Cookies.</strong> Functionality Cookies recognize when you return to the website. This enables the company to create greater content for you and remember your likes and dislikes and other preferences.</li>
              <li><strong>Targeting Cookies.</strong> Targeting Cookies records the visit to our website, the pages navigated to and the links clicked upon. It helps to formulate information relevant to the user's area of interests.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">C. How to manage cookies?</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. Disabling some cookies form the website, may have a negative impact and may result in some non-availability of some features.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you want to remove previously-stored Cookies, you can manually delete the Cookies at any time. However, this will not prevent the Sites from placing further Cookies on your device unless and until you adjust your Internet browser setting as described above.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              You can however obtain up-to-date information about blocking and deleting cookies via these links:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Chrome</li>
              <li>Firefox</li>
              <li>Opera</li>
              <li>Internet Explorer</li>
              <li>Safari</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-8">
              These opt-out mechanisms rely on cookies to remember your choices. If you delete your cookies, use another computer or device, or change browsers, you will need to repeat this process. In addition, opting out of interest-based ads will not opt you out of all ads, but rather only those ads that are personalized to your interests.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. DATA ANALYTICS</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use Analytics tools and search information providers to measure how visitors interact with content on our website. We also use Facebook Custom Audiences to ask Facebook to show you ads that are customized based on your interaction with our websites or our Facebook applications and to measure how you interact with those ads. Additional information on how these services use such technologies can be found on Google's website, and Facebook's website.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              If you do not wish to have data relating to your visits to our websites collected through Google Analytics, you may opt-out by installing the Google Analytics opt-out browser add-on. You may opt-out of Facebook Custom Audiences by visiting Facebook's opt-out page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. AGGREGATED DATA</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              "Aggregated Data" means records that have been stripped of Personal Data and has been combined to provide generalised, anonymous information. Your identity and personal information are not available in Aggregated Data. We combine your Personal Data on an anonymous basis with other information to generate Aggregated Data for internal and commercial use and for sharing with affiliates, subsidiaries and business partners for planning and marketing purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. DATA PROTECTION PRINCIPLES</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Where third parties process Personal Data on behalf of EdTech Informative, we endeavour to obtain assurances from such third parties that your Personal Data will be safeguarded consistently. We understand that it will be accountable for the processing, management and regulation, and storage and retention of all Personal Data held in the form of manual records and on computers.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              All Personal Data obtained and held by EdTech Informative will:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-1">
              <li>be processed fairly, lawfully and in a transparent manner</li>
              <li>be collected for specific, explicit, and legitimate purposes</li>
              <li>be adequate, relevant and limited to what is necessary for the purposes of processing</li>
              <li>be kept accurate and up to date. Every reasonable effort will be made to ensure that inaccurate Personal Data is rectified or erased without delay.</li>
              <li>not be kept for longer than is necessary for its given purpose.</li>
              <li>be processed in a manner that ensures appropriate security of Personal Data including protection against unauthorized or unlawful processing, accidental loss, destruction or damage by using appropriate technical or organisation measures.</li>
              <li>comply with the relevant laws and procedures for international transferring of Personal Data applicable to us.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. LEGAL BASIS FOR PROCESSING YOUR PERSONAL DATA</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Certain jurisdictions require that we have a lawful basis to justify our processing of your Personal Data.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Where applicable, the lawful basis that EdTech Informative relies upon to justify a particular processing activity may differ from the lawful basis used to justify a different processing activity.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              EdTech Informative relies on the following lawful basis to process Personal Data, as permitted under applicable law:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-1">
              <li>Processing necessary for the negotiation, execution, or performance of contracts.</li>
              <li>Processing to comply with legal and regulatory obligations.</li>
              <li>Processing in furtherance of our legitimate interests, including our interests to conduct legitimate business activities (such as improving our products and services, to communicate with you, to secure our systems, among other legitimate interests).</li>
              <li>Processing necessary to protect vital interest of a user or any other natural person.</li>
              <li>Processing necessary for public interest.</li>
              <li>Processing based on your consent.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. CONSENT</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may obtain your consent to collect and use certain types of Personal Data when we are required to do so by law.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Once consent is obtained from the individual to use his or her information for those purposes, EdTech Informative has the individual's implied consent to collect or receive any supplementary information that is necessary to fulfill the same purposes. Express consent will also be obtained if, or when, a new use is identified.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Consent may also be implied where a user is given notice and a reasonable opportunity to opt-out of his or her personal information being used for mail-outs, the marketing of new services or products, and the user does not opt-out.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Subject to certain exceptions (e.g., the personal information is necessary to provide the service or product, or the withdrawal of consent would frustrate the performance of a legal obligation), individuals can withhold or withdraw their consent for EdTech Informative to use their Personal Data in certain ways.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Further, by using this website/ acknowledging this Policy / by voluntarily providing us with your Personal Data, you consent to collection, storage, and processing of your Personal Data in accordance with this Policy and our Terms of Service.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              If you refuse or withdraw your consent, or if you choose not to provide us with any required Personal Data, we may not be able to provide you the services that can be offered on our Platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">12. PURPOSE OF COLLECTING PERSONAL DATA</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect your Personal Data for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-1">
              <li>To fulfill or meet the reason you provided the information;</li>
              <li>We use your Personal Data for managing and processing purposes, including, but not limited to, tracking attendance, progress and completion of a training. As part of our management and processing of the Program, we will use certain Personal Data to administer exams, projects, and other assessments for the Program. For example, as part of an exam, EdTech Informative may use certain information collected from you in order to verify your identity or to monitor your performance during the exam to confirm that you are abiding by the applicable testing rules or requirements;</li>
              <li>To send you updates about the Programs, other EdTech Informative events, platform maintenance or new services provided by EdTech Informative, among other things, through itself or through third parties, via WhatsApp, email, SMS, phone call or any other medium;</li>
              <li>Provide Chat Room services;</li>
              <li>To enhance the quality of our content and product offerings;</li>
              <li>Compliance with security and other mandatory policies and building access;</li>
              <li>Providing information to relevant external authorities for tax, and other purposes as legally required;</li>
              <li>Conducting surveys to assess your satisfaction, including but not limited to its processes or policies;</li>
              <li>Setting up and maintaining accounts and subscriptions with third parties that provide information and research services or communication services;</li>
              <li>Making decisions about your continued engagement, employment or membership;</li>
              <li>Dealing with legal or regulatory disputes or investigations involving you, our work, or other partners, employees, workers and contractors, including accidents at work, potential and actual negligence claims and professional discipline matters;</li>
              <li>To monitor use of our information and communication systems to ensure compliance with our IT and document management policies;</li>
              <li>To ensure network and information security, including preventing unauthorized access to our computer and electronic communications systems and preventing malicious software distribution;</li>
              <li>Business management and planning, including accounting, auditing and insuring;</li>
              <li>Planning or reviewing options in relation to the operation or management;</li>
              <li>Keeping registers required by law or regulation;</li>
              <li>Communicating with you, for example to respond to inquiries;</li>
              <li>Enhancing the safety and security of the services and preventing fraud, or protecting our or our customers', or your rights or property;</li>
              <li>Enforcing applicable terms and conditions and other applicable policies;</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">13. ADVERTISING AND MARKETING</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We strive to provide you with choices regarding certain Personal Data uses, particularly around marketing and advertising. You will receive marketing communications from us if you have requested information from us or if you provided us with your details and expressly consented to receiving that marketing.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may use your personal identification, identity, contact, Electronic and User generated Data to form a view on what we think you may want or need, or what may be of interest to you. This is how we decide which services and offers may be relevant for you.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We also enter into agreements with third parties to serve Ads on our behalf across the internet, social networking sites and blogs. These third parties may collect Personal Data about your visits to our platform and your interactions with our products and use this information to target advertisements for goods and services.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Where electronic direct marketing communications are being sent, you have the option to opt-out in each communication sent, and this choice will be recognised and adhered to by us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">14. DISCLOSURE OF PERSONAL DATA</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              EdTech Informative is a global company and may share the Personal Data collected or provide such access to other companies within the EdTech Informative group.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Examples of third parties with whom EdTech Informative may share Personal Data includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>With government bodies, including tax and social security authorities, to comply with applicable laws (including employment and tax laws), to obtain licenses or approvals, and upon request during an audit or assessment;</li>
              <li>With suppliers, subcontractors and service providers, to maintain an efficient and commercially viable business, including technology, telecom, internet providers;</li>
              <li>With professional advisers, consultants, and employment and recruitment agencies, to conduct background verification and reference checks, administer benefits and payroll, deal with disciplinary and grievance issues and maintain emergency contact details;</li>
              <li>With our legal advisors and external auditors for legal advice and to conduct business audits;</li>
              <li>With service providers for business continuity management and contingency planning in the event of business disruptions;</li>
              <li>With certain companies in order to establish a membership to participate in digital wallets, payment services or rewards program</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-8">
              We require all third parties to respect the security of your Personal Data and to treat it in accordance with the law. We do not allow our third-party service providers to use your Personal Data for their own purposes and only permit them to process your Personal Data for specified purposes and in accordance with our instructions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">15. DATA SUBJECT RIGHTS</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some jurisdictions have provided individuals with certain rights in relation to the processing of their Personal Data. Depending on applicable law, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>Request access to your Personal Data.</li>
              <li>Request correction of your Personal Data (should your Personal Data be inaccurate, incomplete, or obsolete).</li>
              <li>Request deletion of your Personal Data</li>
              <li>Withdraw your consent to processing (where we processed Personal Data on the basis of your consent). Please note that withdrawing your consent applies only to future processing activities.</li>
              <li>Object to the processing of your Personal Data.</li>
              <li>Request restrictions on the processing of your Personal Data.</li>
              <li>Request the transfer of your Personal Data to you or a third party.</li>
              <li>Opt-out of certain transfers to third parties.</li>
              <li>Request to opt out of automated decision making.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              To exercise a right that you believe you may be entitled to under applicable law, please write to us at support@edtechinformative.uk.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may need to verify your identity before we fulfill your request.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Please note that certain conditions in relation to processing of your rights, will vary as many countries have varying data privacy rights. Our response and further processing of request to exercise these rights will depend upon the law applicable in relation to the rights exercised by you. We may refuse requests that are unreasonably repetitive, require disproportionate technical effort, risk the privacy of others, may compromise and ongoing investigation, or are impractical. It is our policy to never discriminate against you for exercising any of these rights.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              You may have the right to complain to a data protection authority about our processing of your Personal Data. For more information, please contact your local data protection authority.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">16. DATA SECURITY</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              EdTech Informative will ensure that appropriate technical and organizational measures are in place, supported by privacy impact and risk assessments, to ensure a high level of security for Personal Data, and secure environment for information held both manually and electronically.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              EdTech Informative implements appropriate security measures designed to prevent unlawful or unauthorized processing of Personal Data and accidental loss of or damage to Personal Data. EdTech Informative maintains written security management policies and procedures designed to prevent, detect, contain, and correct violations of measures taken to protect the confidentiality, integrity, availability, or security of your Personal Data. These policies and procedures assign specific data security responsibilities and accountabilities to specific individuals, include a risk management program that includes periodic risk assessment and provide an adequate framework of controls that safeguard your personal information.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition, as part of its organizational security measures, employees at EdTech Informative must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>ensure that all files or written information of a confidential nature are stored in a secure manner and are only accessed by people who have a need and a right to access them</li>
              <li>ensure that all files or written information of a confidential nature are not left where they can be read by unauthorized people</li>
              <li>check regularly on the accuracy of data being entered into computers</li>
              <li>always use the passwords provided to access the computer system cautiously and such access should not be circulated, unless absolutely necessary</li>
              <li>use computer screen blanking to ensure that Personal Data is not left on screen when not in use</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Personal Data should not be kept or transported on laptops, USB sticks, or similar devices, unless authorized. Where Personal Data is recorded on any such device it should be protected by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
              <li>ensuring that data is recorded on such devices only where absolutely necessary</li>
              <li>ensuring that laptops or USB drives are not left lying around where they can be stolen</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Failure to follow EdTech Informative's rules on data security may be dealt with via the disciplinary procedure followed within EdTech Informative. Appropriate sanctions include dismissal with or without notice dependent on the severity of the failure.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              We also take steps to ensure that our service providers, contractors and other third parties maintain similar levels of data protection measures when processing your Personal Data. While we strive to secure your Personal Data, please note that 100% security of Personal Data cannot be guaranteed and that EdTech Informative shall not be liable for any misuse or loss of Personal Data carried out by a third party cloud service provider.
            </p>

            <div className="bg-edtech-orange/5 border border-edtech-orange/20 rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection Officer</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The company, in accordance with the applicable laws, and all applicable rules made thereunder, has appointed a Data Protection Officer; who can be reached at the details below:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li><strong>Name:</strong> Yashdeep Rana</li>
                <li><strong>Email Address:</strong> yashdeeprana@edtechinformative.uk</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">General Contact</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li><strong>Email:</strong> support@edtechinformative.uk</li>
                <li><strong>Address:</strong> EdTech Informative, Privacy Department</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
