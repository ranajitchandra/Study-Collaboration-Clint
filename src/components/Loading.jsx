
export default function Loading() {

    return (
        <>
            <div className="fixed inset-0 bg-black/95 bg-opacity-50 flex items-center justify-center z-50">
                <div className="w-16 h-16 border-8 border-dashed border-primary rounded-full animate-spin"></div>
            </div>
        </>
    )
}