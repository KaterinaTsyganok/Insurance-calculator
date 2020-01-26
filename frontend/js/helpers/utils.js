class Utils {
    static parseRequestURL() {
        const url = location.hash.slice(2),
            request = {};

        [request.resource, request.id] = url.split('/');

        return request;
    }
}

export default Utils;