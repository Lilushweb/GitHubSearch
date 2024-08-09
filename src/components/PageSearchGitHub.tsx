import { Button, TextField } from "@mui/material"
import './style/pageSearchGitHub.sass'
import { useEffect, useState } from "react"
import { useSearchRepositoriesQuery } from "../store/gitHubApi"
import InformationTable from "./InformationTable"
import CustomSelect from "./CustomSelect"
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

export default function PageSearchGitHub() {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [submittedTerm, setSubmittedTerm] = useState<string>('') // Состояние для отправленного запроса
    const [first, setFirst] = useState<number>(10)
    const [cursors, setCursors] = useState<(string | null)[]>([null])// Массив для хранения курсоров
    const [totalPage, setTotalPage] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)// Текущая позиция курсора 
    const { data, error, isLoading } = useSearchRepositoriesQuery({ submittedTerm, first, after: cursors[currentPage], }, {
        skip: !submittedTerm, // Не выполнять запрос, если submittedTerm пустой
    }) // отправляем запрос 
    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    } // функция для добавление текста с input в state searchTerm

    const handleClickNextPage = () => {
        if (!data?.hasNextPage) return
        setCursors([...cursors, data?.endCursor])
        setCurrentPage(currentPage + 1)
    } // Функция для пагинации и переключения странички на следующую 

    const handleClickBackPage = () => {
        if (currentPage === 0) return
        setCurrentPage(currentPage - 1)
    }
    const handleClick = () => {
        setSubmittedTerm(searchTerm) // Установить состояние отправленного запроса
        setCurrentPage(0)
        setCursors([null])
    }

    useEffect(() => {
        if (data && data.repositoryCount) {

            setCursors([data.endCursor]) // Проверяйте, если это необходимо
            setTotalPage(Math.ceil(data.repositoryCount / first))

        }
    }, [first, data?.repositoryCount])
    return (
        <div>
            <header className="head">
                <TextField
                    id="outlined-basic"
                    placeholder="Введите поисковый запрос"
                    variant="outlined"
                    sx={{
                        width: '60%',
                    }}
                    size="small"
                    className="customTextField"
                    onChange={handleSearchTermChange}
                />
                <Button
                    variant="contained"
                    className="customButton"
                    sx={{
                        width: '105px',
                        height: '42px'
                    }}
                    onClick={handleClick}
                >ИСКАТЬ</Button>
            </header>
            {!data && <h1 className="hello">Добро пожаловать</h1>}
            {data && !isLoading &&
                <div>
                    <InformationTable data={data.repositories} />
                    <footer className="footers">
                        <span>Rows per page</span>
                        <CustomSelect first={first} setFirst={setFirst} setCurrentPage={setCurrentPage} setCursors={setCursors} />
                        {<span>1 - {totalPage} of {currentPage + 1}</span>}

                        <div className="boxNavigate" onClick={handleClickBackPage}><ArrowBackIos sx={{ fontSize: '1rem' }} /></div>


                        <div className="boxNavigate" onClick={handleClickNextPage}><ArrowForwardIos sx={{ fontSize: "1rem" }} /></div>


                    </footer>
                </div>
            }
            {isLoading && <h1>Идет загрузка</h1>}
            {error && <h1>Произошла ошибка</h1>}

        </div >
    )
}
