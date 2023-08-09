"use client";

import Service from "@/utils/api/services"
import ls from "@/utils/localStorage/ls";
import { useRouter } from "next/navigation";

interface SearchParams {
    accessToken: string;
    error: string;
}

export default function Callback({ searchParams }: { searchParams: SearchParams }) {
    const router = useRouter();
    //comprobacion de datos
    const accessTokenExist = async (token: String) => {
        let ServiceResponse: any = await Service.User.getUserWithToken(token) //* primera obtencion de la data del usuario

        if (ServiceResponse.data !== undefined) {
            let Data: any = ServiceResponse.data
            let Data2: any = await Service.User.getUserWithId(Data._id) //* Con esta data obtengo el status del usuario
            let statusMeta = Data2.data.status ?? ""

            //* Guardo la informacion del usuario relevante como el token y el status actual
            let dataToStorage = { token, ...Data, statusMeta }
            ls.addStorage("user", dataToStorage)

            const lastDog = (rol: String) => {
                //! User validation if is approved and redirect to dashboard
                if (statusMeta === "approved") return router.push("/dashboard")
                router.push(`/${rol}/approval`)
            }

            switch (Data.role) {
                case "admin":
                    return router.push("/dashboard")
                case "pp":
                    return lastDog("pp")
                case "vvb":
                    return lastDog("vvb")
            }
        }
    }

    const accessTokenError = (error: String) => {
        console.log(error)
        //! Agregar retorno de error para depurar y saber el gierror
    }

    if (searchParams?.accessToken !== undefined) accessTokenExist(searchParams.accessToken)
    if (searchParams?.error !== undefined) accessTokenError(searchParams.error)

    return <div></div>;
}