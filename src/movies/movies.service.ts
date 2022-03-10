import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/Movie.entitiy';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];
    
    getAll(): Movie[] {
        return this.movies;
    }

    getOne(id: number ): Movie {
        const movie = this.movies.find(mv => mv.id === id);
        if(!movie){
            throw new NotFoundException(`Movie with ID ${id} not found.`);
        }
        return movie;
    }

    deleteOne(id: number){
        this.getOne(id);
        //이미 getOne에서 예외처리가 되기때문에 이렇게만 적어도됨;
        this.movies = this.movies.filter(mv => mv.id !== id);
    }

    create(movieDate: CreateMovieDto){
        this.movies.push({
            id: this.movies.length + 1,
            ...movieDate
        })
    }

    update(id:number, updateData: UpdateMovieDto){
        const movie = this.getOne(id);
        //해당 아이템 가져오기
        this.deleteOne(id);
        //해당 아이템 일단 지우기
        this.movies.push({...movie, ...updateData});
        //가져왔던 아이템 복사한 다음에, 업데이트 되는 부분 복사하기
    }
}
