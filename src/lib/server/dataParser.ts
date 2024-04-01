import y, { type AnyObject, type Maybe } from "yup";

export async function parseData<T extends Maybe<AnyObject>>(request: Request, schema: y.ObjectSchema<T>) {
    // Convert formdata
    const data: { [key: string]: any } = {};
    const formData = await request.formData()
    // Convert formdata to object, keeping track of multiple values/name
    for (const [key, value] of formData.entries()) {
        if (key in data) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    // Validate schema
    const result = schema.validate(data, {
        stripUnknown: true,
        disableStackTrace: true,
        abortEarly: false
    }).catch((err: any) => {
        console.error(err.errors);
        return { errors: err.errors };
    });

    return result;
}