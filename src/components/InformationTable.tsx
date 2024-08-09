import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, } from '@mui/material'
import { ArrowDownward, ArrowUpward, Star } from '@mui/icons-material'
import { Repository } from "../store/type"
import './style/informationTable.sass'
import { useMemo, useState, FC } from "react"

interface SearchList {
    data: Repository,
}

const InformationTable: FC<SearchList> = ({ data }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Repository; direction: 'ascending' | 'descending' } | null>(null)//Состояние для сортиров
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null) // Состояние для выбранного репозитория

    const hendleRowClick = (repo: Repository) => {
        setSelectedRepo(repo)
    }

    // Функция сортировки данных
    const sortedData = useMemo(() => {
        let sortableItems = [...data]
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (sortConfig.key === 'primaryLanguage') {
                    const langA = a.primaryLanguage?.name || "" // пустая строка для null
                    const langB = b.primaryLanguage?.name || "" // пустая строка для null
                    return sortConfig.direction === 'ascending'
                        ? langA.localeCompare(langB)
                        : langB.localeCompare(langA)
                } else if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
                    return sortConfig.direction === 'ascending'
                        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                        : b[sortConfig.key].localeCompare(a[sortConfig.key])
                } else {
                    // Сравнение чисел (для forkCount, stargazerCount)
                    return sortConfig.direction === 'ascending'
                        ? (a[sortConfig.key] as number) - (b[sortConfig.key] as number)
                        : (b[sortConfig.key] as number) - (a[sortConfig.key] as number)
                }
            })
        }
        return sortableItems
    }, [data, sortConfig])
    // Запрос сортировки
    const requestSort = (key: keyof Repository) => {
        let direction: 'ascending' | 'descending' = 'ascending'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    return (
        <main>
            <h1 className="result">Результаты поиска</h1>
            <TableContainer
                component={Paper}
                sx={{
                    width: '60%',
                    position: 'absolute',
                    left: '32px',
                    top: '243px',
                    height: '600px',
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ position: "sticky" }}>
                        <TableRow>
                            <TableCell onClick={() => requestSort('name')}>
                                Название
                                {sortConfig?.key === "name" && (sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />)}
                            </TableCell>
                            <TableCell align="right" onClick={() => requestSort('primaryLanguage')}>
                                Язык
                                {sortConfig?.key === 'primaryLanguage' && (
                                    sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />
                                )}
                            </TableCell>
                            <TableCell align="right" onClick={() => requestSort('forkCount')}>
                                Число форков
                                {sortConfig?.key === 'forkCount' && (
                                    sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />
                                )}
                            </TableCell>
                            <TableCell align="right" onClick={() => requestSort('stargazerCount')}>
                                Число звезд
                                {sortConfig?.key === 'stargazerCount' && (
                                    sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />
                                )}
                            </TableCell>
                            <TableCell align="right" onClick={() => requestSort('updatedAt')}>
                                Дата обновления
                                {sortConfig?.key === 'updatedAt' && (
                                    sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />
                                )}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((el, i: number) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => hendleRowClick(el)}
                            >
                                <TableCell component="th" scope="row">
                                    {el.name}
                                </TableCell>
                                <TableCell align="right">{el.primaryLanguage ? el.primaryLanguage.name : "Не указано"}</TableCell>
                                <TableCell align="right">{el.forkCount}</TableCell>
                                <TableCell align="right">{el.stargazerCount}</TableCell>
                                <TableCell align="right">{new Date(el.updatedAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Container className="container" sx={{
                width: '480px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {!selectedRepo && <span className="rep">Выберете репозиторий</span>}
                {selectedRepo &&
                    <div className="selectedRepo">
                        <h3 className="nameRepo">{selectedRepo.name}</h3>
                        <div className="flexLanguageAndStar">
                            <div className="boxLanguage">
                                {selectedRepo.primaryLanguage ? selectedRepo.primaryLanguage.name : "Не указан"}
                            </div>
                            <div className="starBox">
                                <Star className="star" />
                                <span>{selectedRepo.stargazerCount}</span>
                            </div>
                        </div>
                        <div className="language-node">
                            {selectedRepo.languages?.map((leng: string) => (
                                <div key={leng} className="language-item">
                                    {leng}
                                </div>
                            ))}
                        </div>
                        <div className="description">{selectedRepo.description ? selectedRepo.description : "Описание отсутствует"}</div>
                    </div>
                }
            </Container>
        </main >
    )
}

export default InformationTable