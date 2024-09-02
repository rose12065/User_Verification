const User =require('../models/user')

exports.register=async(req,res)=>{
    try {
        const { name, email, phoneNumber, aadhar, dob } = req.body;
        const newUser = new User({ name, email, phoneNumber, aadhar, dob });
         const user= await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err.message });
      }

}

exports.verifyPhone=async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ phoneNumber: user.phoneNumber });
  } catch (error) {
    console.error('Error fetching phone number:', error);
    res.status(500).json({ message: 'Server error' });
  }
  }

  exports.sentOtp=async(req,res)=>{
    const { phoneNumber } = req.body;

    try {
        // Generate a random OTP (you can customize this as per your needs)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP in session (or use another secure method to store it)
        req.session.otp = otp;

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: '+1 510 306 7592',
            to: phoneNumber
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP', error });
    }
  }