const Page = () => {
    return <div>
        <div>interact</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'rgb(200, 200, 200)', padding: '50px'}}>
            <div style={{width: 200, height: 200, background: 'rgb(255, 0, 0)'}}>div1</div>
            <div style={{width: 200, height: 200, background: 'rgb(0, 255, 0)'}}>div2</div>
            <div style={{width: 200, height: 200, background: 'rgb(0, 0, 255)'}}>div2</div>
        </div>
    </div>
}
export default Page;