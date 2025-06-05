import {useAuth} from "./auth";


export function Role({ has, children }) {
    const { pilot } = useAuth();

    const hasPermission = pilot?.permissions?.some(
        (permission) => permission.name === has
    );

    return hasPermission ? <>{children}</> : null;
}