const express = require("express");
const { Resend } = require("resend");

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/send-otp", async (req, res) => {
	try {
		const { email, name, otp } = req.body;

		if (!email || !name || !otp) {
			return res.status(400).json({
				success: false,
				message: "Email, name and OTP are required",
			});
		}

		const html = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>

			<body style="
				margin:0;
				padding:0;
				background:#f4f7fb;
				font-family:Arial, Helvetica, sans-serif;
			">

				<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
					<tr>
						<td align="center">

							<table
								width="100%"
								cellpadding="0"
								cellspacing="0"
								style="
									max-width:600px;
									background:#ffffff;
									border-radius:18px;
									overflow:hidden;
									box-shadow:0 8px 30px rgba(0,0,0,0.08);
								"
							>

								<!-- Header -->
								<tr>
									<td style="
										background:#031f39;
										padding:35px 30px;
										text-align:center;
									">
										<h1 style="
											margin:0;
											color:#ffffff;
											font-size:30px;
											letter-spacing:1px;
										">
											Welcome! 👋
										</h1>

										<p style="
											margin:10px 0 0;
											color:#c7d6e3;
											font-size:15px;
										">
											Let's verify your email address
										</p>
									</td>
								</tr>

								<!-- Content -->
								<tr>
									<td style="padding:40px 35px;">

										<p style="
											margin:0 0 15px;
											color:#031f39;
											font-size:18px;
										">
											Hi <strong>${name}</strong>,
										</p>

										<p style="
											margin:0 0 25px;
											color:#666666;
											font-size:15px;
											line-height:1.7;
										">
											Thanks for signing up! Use the verification
											code below to complete your registration.
										</p>

										<!-- OTP -->
										<table
											width="100%"
											cellpadding="0"
											cellspacing="0"
										>
											<tr>
												<td align="center">
													<div style="
														display:inline-block;
														background:#ffffff;
														border:2px dashed #031f39;
														border-radius:14px;
														padding:18px 35px;
														letter-spacing:10px;
														font-size:34px;
														font-weight:bold;
														color:#031f39;
													">
														${otp}
													</div>
												</td>
											</tr>
										</table>

										<p style="
											margin:25px 0 5px;
											text-align:center;
											color:#777777;
											font-size:14px;
										">
											Enter this code in the signup page.
										</p>

										<p style="
											margin:0;
											text-align:center;
											color:#999999;
											font-size:13px;
										">
											Please don't share this code with anyone.
										</p>

									</td>
								</tr>

								<!-- Footer -->
								<tr>
									<td style="
										background:#031f39;
										padding:22px;
										text-align:center;
									">
										<p style="
											margin:0;
											color:#c7d6e3;
											font-size:12px;
										">
											If you didn't request this verification code,
											you can safely ignore this email.
										</p>

										<p style="
											margin:10px 0 0;
											color:#8fa3b5;
											font-size:11px;
										">
											© 2026 Linkite - Short & Secure
										</p>
									</td>
								</tr>

							</table>

						</td>
					</tr>
				</table>

			</body>
			</html>
		`;

		const { data, error } = await resend.emails.send({
			from: "Linkite<me@rahulchowdhury.in>", // verified domain
			to: email,
			subject: "Linkite Onboarding - Verification Code",
			html,
		});

		if (error) {
			console.error("Resend error:", error);
			return res.status(500).json({
				success: false,
				message: "Failed to send OTP",
			});
		}

		return res.status(200).json({
			success: true,
			message: "OTP sent successfully",
			id: data?.id,
		});
	} catch (error) {
		console.error("Unexpected error sending OTP:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to send OTP",
		});
	}
});

module.exports = router;
