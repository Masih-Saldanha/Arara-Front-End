import React from "react";
import { Oval } from "react-loader-spinner";

function Loading(props: { message: string; }) {
    const { message } = props;

    return (
        <div className="d-flex flex-column align-items-center mt-3">
            <Oval color="#333333" secondaryColor='#6D6D6D' height={36} width={36} />
            <h2 className="mt-3 mb-3 text-center text-muted">{message}</h2>
        </div>
    )
};

export default Loading;