import { Textarea } from "@chakra-ui/react";

const PathInput = () => {
    const changeHandler = (x) => {
        console.log(x.target.value);
    };

    return (
        <Textarea
            onChange={changeHandler}
            defaultValue={"M200 200 L 400 200 400 400 200 400z"}
        ></Textarea>
    );
};

export default PathInput;
