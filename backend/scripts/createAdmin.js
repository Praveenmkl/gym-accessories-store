import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const getArg = (flag) => {
    const idx = process.argv.indexOf(flag);
    if (idx === -1) return "";
    return process.argv[idx + 1] || "";
};

const getPositionalArgs = () => {
    // Accept positional args for npm script compatibility:
    // node scripts/createAdmin.js <email> <password> <name>
    return process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
};

const createOrPromoteAdmin = async () => {
    const positional = getPositionalArgs();
    const email = getArg("--email") || positional[0] || "";
    const password = getArg("--password") || positional[1] || "";
    const name = getArg("--name") || positional[2] || "Admin";

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing in .env");
    }

    if (!email || !password) {
        throw new Error("Usage: npm run create-admin -- --email admin@example.com --password yourPassword --name Admin");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing) {
        existing.name = name;
        existing.password = hashedPassword;
        existing.role = "admin";
        await existing.save();
        console.log(`Updated existing user as admin: ${email}`);
    } else {
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });
        console.log(`Created new admin user: ${email}`);
    }

    await mongoose.disconnect();
};

createOrPromoteAdmin()
    .then(() => {
        console.log("Done.");
        process.exit(0);
    })
    .catch(async (error) => {
        console.error(error.message);
        try {
            await mongoose.disconnect();
        } catch {
            // no-op
        }
        process.exit(1);
    });
