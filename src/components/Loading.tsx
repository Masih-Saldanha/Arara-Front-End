import React from "react";
import { Oval } from "react-loader-spinner";
import styled from "styled-components";

function Loading(props: { message: string; }) {
    const { message } = props;

    return (
        <Load>
            <Oval color="#333333" secondaryColor='#6D6D6D' height={36} width={36} />
            <NoPosts>{message}</NoPosts>
        </Load>
    )
};

const Load = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 52px;
`

const NoPosts = styled.h2`
    margin: 16px 0;
    text-align: center;
    color: #6D6D6D;
`

export default Loading;