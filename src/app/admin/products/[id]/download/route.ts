import db from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"

export async function GET(req: NextRequest, {params: {id}}: {params: {id : string}}){
    const product = await db.product.findUnique({where: {id}, select: {filePath: true, name: true}})
    if(product == null) return notFound()

    //! Downloading file
    const {size} = await fs.stat(product.filePath)
    const file = await fs.readFile(product.filePath)
    const extension = product.filePath.split(".").pop() //? Getting the extension of the file being saved

    return new NextResponse(file, {headers: {
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
        "Content-Length": size.toString()
    }})
}