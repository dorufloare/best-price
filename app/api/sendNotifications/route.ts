import { getProductById } from "@/lib/actions/product.actions";
import { getAllUsers } from "@/lib/actions/user.actions";
import { checkPriceDrop } from "@/lib/product.utils";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAIL_USER = process.env.CONTACT_MAIL_USER;
const MAIL_PASS = process.env.CONTACT_MAIL_PASSWORD;
const API_KEY = process.env.API_KEY;

export async function POST(request: Request) {
	const apiKey = request.headers.get('x-api-key');

	if (!apiKey || apiKey !== API_KEY) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

  try {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: MAIL_USER, 
        pass: MAIL_PASS, 
      },
    });

    const users = await getAllUsers()
		console.log("w")

		users.forEach((user : UserData) => {
			const productIds = user.products;
			const email = user.email;

			productIds.forEach(async (productId : string) => {
				const product = await getProductById(productId);
				const dashboardLink = process.env.NEXT_PUBLIC_BASE_URL + "/product/" + product._id;

				if (checkPriceDrop(product)) {
					console.log(`Email to user: ${email} for product ${product.name}`)

					const currPrice = product.priceHistory[product.priceHistory.length - 1];
					const lastPrice = product.priceHistory[product.priceHistory.length - 2];

					const mailOptions = {
						from: MAIL_USER,
						to: email,
						subject: "Price drop detected!",
						html: `
							<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
								<h2>Price Drop Alert for <strong>${product.name}</strong>!</h2>
								
								<p>Good news! The price of <strong>${product.name}</strong> has dropped.</p>
								<p><strong>
									<span style="color: red; text-decoration: line-through;">${lastPrice}</span> 
									<span style="color: red;">→ ${currPrice}</span></strong>
								</p>
								<p><a href="${dashboardLink}" style="color: #007BFF; text-decoration: none;">Check out your product here</a></p>
								<br />
								<p>Don't miss out on this great deal!</p>
							</div>
						`,
					};
					await transporter.sendMail(mailOptions);
				}
			});

		});

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
