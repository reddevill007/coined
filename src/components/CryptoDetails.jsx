import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Loading from './Loading';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import Linechart from './Linechart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
    const { coinId } = useParams();
    const [timePeriod, setTimePeriod] = useState('7d');
    const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
    const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timePeriod });
    const cryptoDetails = data?.data?.coin;

    if (isFetching) return <Loading />

    const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

    const stats = [
        { title: 'Price to USD', value: `$ ${cryptoDetails?.price && millify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
        { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
        { title: '24h Volume', value: `$ ${cryptoDetails?.volume && millify(cryptoDetails?.volume)}`, icon: <ThunderboltOutlined /> },
        { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
        { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
    ];

    const genericStats = [
        { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
        { title: 'Aprroved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
        { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
        { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
    ];

    return (
        <div className="container">
            <Col className='coin-detail-container'>
            <Col className="coin-heading-container">
                <Title level={2} className='coin-name' >
                    {data?.data?.coin.name} ({data?.data?.coin.symbol}) Price
                </Title>
                <p> live price in US Dollar (USD). View value statistics, market cap and supply.</p>
            </Col>

            <Linechart coinHistory={coinHistory} currentPrice={millify(cryptoDetails?.price)} coinName={data?.data?.coin.name} />

            <Col className="stats-container">
                <Col className="coin-value-statistics">
                    <Col className="coin-value-statistics-heading">
                        <Title level={3} className='coin-details-heading'>
                            {data?.data?.coin.name} Value Statistics
                        </Title>
                        <p>An overview showing the statistics of {data?.data?.coin.name}, such as the base and quote currency, the rank, and trading volume.</p>
                    </Col>
                    {stats.map(({ icon, title, value }) => (
                        <Col className="coin-stats">
                            <Col className="coin-stats-name">
                                <p>{icon}</p>
                                <p>{title}</p>
                            </Col>
                            <p className='stats'>{value}</p>
                        </Col>
                    ))}
                </Col>
                <Col className="other-stats-info">
                    <Col className="coin-value-statistics-heading">
                        <Title level={3} className='coin-details-heading'>
                            Other Statistics
                        </Title>
                        <p>An overview showing the statistics of all cryptocurrency.</p>
                    </Col>
                    {genericStats.map(({ icon, title, value }) => (
                        <Col className="coin-stats">
                            <Col className="coin-stats-name">
                                <p>{icon}</p>
                                <p>{title}</p>
                            </Col>
                            <p className='stats'>{value}</p>
                        </Col>
                    ))}
                </Col>
            </Col>
            <Col className="coin-desk-link">
                <Row className="coin-desk">
                    <div className='text-info' style={{color: '#fff', fontSize: 20}}>
                        <h1 className='text-info'>What is {data?.data?.coin.name}</h1>
                        <small className="text-muted" style={{color: '#2da5db'}}>
                            {HTMLReactParser(cryptoDetails.description)}
                        </small>
                    </div>
                </Row>
                <Col className="coin-links">
                    <h5 level={3} className='coin-details-heading'>
                        {data?.data?.coin.name} Links
                    </h5>
                    {cryptoDetails.links.map((link) => (
                        <Row className="coin-link" key={link.name}>
                            <h5 level={5} className='link-name'   style={{color: '#fff', fontSize: 20}}>
                                {link.type}
                            </h5>
                            <a href={link.url} target="_blank" rel='noreferrer'>
                                {link.name}
                            </a>
                        </Row>
                    ))}
                </Col>
            </Col>
        </Col>
        </div>
    )
}

export default CryptoDetails