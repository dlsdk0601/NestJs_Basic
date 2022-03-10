import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, isString, IsString } from "class-validator";
import { CreateMovieDto } from "./create-movie.dto";

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    
}