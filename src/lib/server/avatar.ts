import sharp from "sharp";
import { logger } from "./logger";
import { prisma } from "./prisma";
import { unlink } from "fs/promises";
import { PUBLIC_MEDIA_PATH } from "$env/static/public";
import { safeUserOmit } from "lib/user";

export class Avatar {
    image!: sharp.Sharp;
    metadata?: sharp.Metadata;


    constructor(image: sharp.Sharp) {
        this.image = image;
    }

    public static async delete(id: string) {
        await unlink(`${PUBLIC_MEDIA_PATH}/${id}.jpg`).catch((error) => {
            logger.error(`Failed to delete avatar for ${id}.`, { error });
        });
    }

    public static async loadImage(file: ArrayBuffer) {
        const avatar = new Avatar(sharp(file));
        await avatar.validate();
        return avatar;
    }

    async validate() {
        try {
            this.metadata = await this.image.metadata();
        } catch (e) {
            throw new Error("Failed to read image metadata");
        }
        if (!this.metadata.format || !this.metadata.width || !this.metadata.height) {
            throw new Error("Invalid image metadata");
        }
    }

    public async save(id: string, isDiscordAvatar = false) {
        const now = Date.now();
        try {
            await this.image
                .rotate()
                .jpeg({ mozjpeg: true, quality: 80 })
                .resize(640, 800)
                .toFile(`${PUBLIC_MEDIA_PATH}/${id}.jpg`);
        } catch (e) {
            logger.error(`Failed to process image for ${id}.`, { e });
            await prisma.user.update({ where: { id }, data: { uploadedAt: null } });
            throw new Error("Failed to process image");
        }

        const user = await prisma.user.update({
            where: { id },
            omit: safeUserOmit,
            data: {
                uploadedAt: new Date(),
                isDiscordAvatar,
            }
        });

        logger.info(`ℹ️  Processed avatar in ${Date.now() - now}ms`);
        return user;
    }
}
