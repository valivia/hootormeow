import y, { type AnyObject, type Maybe } from "yup";

export async function parseData<T extends Maybe<AnyObject>>(request: Request, schema: y.ObjectSchema<T>) {
    // Convert formdata
    const data: Record<string, unknown> = {};
    const formData = await request.formData();
    // Convert formdata to object, keeping track of multiple values/name
    for (const [key, value] of formData.entries()) {
        if (key in data) {
            if (Array.isArray(data[key])) {
                (data[key] as unknown[]).push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    // Validate schema
    return schema.validate(data, {
        stripUnknown: true,
        disableStackTrace: true,
        abortEarly: false
    }).catch((err) => {
        console.error(err.errors);
        return { errors: err.errors };
    });
}